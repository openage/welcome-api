'use strict'
let moment = require('moment-timezone')
const logger = require('@open-age/logger')('appointments')
const offline = require('@open-age/offline-processor')

const db = require('../models')
const appointments = require('../services/appointments')
const visitors = require('../services/visitors')

const agents = require('../services/agents')
const mapper = require('../mappers/appointment')

exports.create = async (req, res) => {
    let log = req.context.logger.start('api/appointments:create')

    let agent = await agents.getByIdOrContext(req.body.agent.id, req.context)

    if (!agent) {
        throw new Error('agent does not exist')
    }

    req.context.agent = agent

    let query = {
        agent: req.context.agent.id,
        till: {
            $lte: req.body.till
        },
        from: {
            $gte: req.body.from
        },
        status: {
            $in: ['scheduled', 'rescheduled']
        }
    }

    let bookedAppointment = await db.appointment.findOne(query).lean()

    if (bookedAppointment) {
        throw new Error('appointment already booked')
    }

    let visitorData = req.body.visitor || {
        user: req.context.user,
        organization: req.context.agent.organization
    }

    let visitor = await visitors.findOrCreate(visitorData, req.context)

    log.debug('new visitor', `${visitor}`)

    let futureAppointmentWithAgent = await appointments.futureAppointments({
        visitorId: visitor.id,
        agentId: agent.id
    }, req.context)

    if (futureAppointmentWithAgent && futureAppointmentWithAgent.length) {
        throw new Error('You can not book more appointments with this doctor.')
    }

    let queueType = await db.queueType.findOne({
        organization: req.context.agent.organization,
        name: req.body.queueType ? req.body.queueType.name : 'opd'
    })

    let model = {
        purpose: req.body.purpose,
        from: req.body.from,
        till: req.body.till,
        data: req.body.data,
        agent: agent,
        visitor: visitor,
        organization: req.context.organization || req.context.agent.organization,
        status: req.body.status || 'scheduled',
        queueType: queueType
    }

    let appointment = await appointments.create(model, req.context)
    log.debug('new appointment', `${appointment}`)
    log.end()
    return mapper.toModel(appointment)
}

exports.update = async (req) => {
    let log = req.context.logger.start('update')

    let model = req.body
    let query

    if (req.body.agent) {
        model.agent = req.body.agent.id
    }

    let appointment = await appointments.getById(req.params.id, req.context)

    if (req.body.till && req.body.from) {
        query = {
            agent: appointment.agent.id,
            till: {
                $lte: req.body.till
            },
            from: {
                $gte: req.body.from
            },
            status: {
                $in: ['scheduled', 'rescheduled']
            }
        }

        let bookedAppointment = await db.appointment.findOne(query).lean()
        if (bookedAppointment) {
            throw new Error('appointment already booked')
        }
    }

    let updatedAppointment = await appointments.update(model, appointment, req.context)
    log.debug('updatedAppointment', `${updatedAppointment}`)
    log.end()
    return mapper.toModel(updatedAppointment)
}

exports.get = async (req) => {
    let log = req.context.logger.start('get')

    let appointment = await appointments.getById(req.params.id, req.context)
    log.debug('appointment', `${appointment}`)
    log.end()
    return mapper.toModel(appointment)
}

exports.search = async (req, res) => {
    let log = req.context.logger.start('api/appointments:search')
    let query = {}

    query.status = req.query.status || { $in: ['scheduled', 'rescheduled'] }

    if (req.context.organization) {
        query.organization = req.context.organization.id
    }

    if (req.query.agentId) {
        let queryAgentIds = req.query.agentId.split(',')
        let agentIds = queryAgentIds.map(id => id.toObjectId())
        query.agent = {
            $in: agentIds
        }
    }

    if (req.query.visitorId) {
        let queryVisitorIds = req.query.visitorId.split(',')
        let visitorIds = queryVisitorIds.map(id => id.toObjectId())
        query.visitor = {
            $in: visitorIds
        }
    }

    if (req.query.date) {
        query.from = {
            $gte: moment(req.query.date).startOf('day')
        }
        query.till = {
            $lt: moment(req.query.date).endOf('day')
        }
    }

    let appointmentList = await db.appointment.find(query).populate('organization').populate({
        path: 'agent visitor',
        populate: {
            path: 'user'
        }
    })

    log.debug('appointments', `${appointmentList}`)

    log.end()
    return mapper.toSearchModel(appointmentList)
}

exports.visitorAppointments = async (req, res) => {
    let log = logger.start('visitorsAppointment')

    let userId
    if (req.params.id === 'my') {
        userId = req.context.user.id
    } else {
        let visitor = await db.visitor.findById(req.params.id)
        if (!visitor) {
            throw new Error('visitor not found')
        }
        userId = visitor.user.toString()
    }

    const upcomingAppointments = await appointments.visitorAppointments(userId, {
        $and: [{
            status: { $in: ['scheduled', 'rescheduled'] }
        }, {
            from: { $gt: moment().toDate() }
        }]
    }, { from: 1 }, req.context)

    const oldAppointments = await appointments.visitorAppointments(userId, {
        $or: [{
            status: { $in: ['visited'] }
        }, {
            from: { $lt: moment().toDate() }
        }]
    }, { from: -1 }, req.context)

    const cancelledAppointments = await appointments.visitorAppointments(userId, {
        $and: [{
            status: { $in: ['cancelled', 'closed', 'failed'] }
        }]
    }, { from: 1 }, req.context)

    const appointmentsDetails = [upcomingAppointments, oldAppointments, cancelledAppointments]

    await Promise.all(appointmentsDetails).spread((upcomingAppointments, oldAppointments, cancelledAppointments) => {
        var visitorSchedule = {}
        let upcoming = mapper.toVisitorAppointments(upcomingAppointments)
        let old = mapper.toVisitorAppointments(oldAppointments)
        let cancelled = mapper.toVisitorAppointments(cancelledAppointments)
        visitorSchedule.upcoming = upcoming
        visitorSchedule.old = old
        visitorSchedule.cancelled = cancelled
        log.end()
        res.data(visitorSchedule)
    })
}

exports.agentAppointments = async (req) => {
    let log = logger.start('agentAppointments')

    let from = req.query.from || moment().toDate()
    let fromDate = from ? moment(from).startOf('day')._d : moment().startOf('day')._d
    let tillDate = from ? moment(from).endOf('day')._d : moment().endOf('day')._d
    let query = {
        status: { $in: ['scheduled', 'rescheduled'] },
        from: {
            $gte: fromDate,
            $lt: tillDate
        }
    }

    let id = null
    let agent = null
    if (req.params.id !== 'my') {
        agent = await agents.get(req.params.id, req.context)
    } else {
        agent = await agents.getOrCreate(id, req.context)
    }

    if (!agent) {
        throw new Error('agent not found')
    } else {
        req.context.agent = agent
    }

    let agentSchedule = await appointments.agentAppointments(query, req.context)

    log.end()
    return mapper.toSearchModel(agentSchedule)
}

exports.cancelAgentAppointment = async (req) => {
    let log = req.context.logger.start('api/appointments:cancelAgentAppointment')

    let agentId = req.params.id === 'my' ? null : req.params.id

    let agent = await agents.getByIdOrContext(agentId, req.context)

    if (!agent) {
        throw new Error('agent not found')
    }

    let data = {
        from: req.body.from,
        till: req.body.till,
        agentId: agent.id
    }

    req.context.processSync = true
    offline.queue('appointment', 'cancelAgentAppointment', data, req.context)

    log.end()
    return {
        message: `Appointments from: ${moment(data.from).format('MMMM Do YYYY, h:mm:ss a')} to till: ${moment(data.till).format('MMMM Do YYYY, h:mm:ss a')} process to cancel`
    }
}

exports.bulkUpdate = async (req) => {
    let log = req.context.logger.start('api/appointments:bulkUpdate')

    let items = req.body.items || []

    if (!items.length) {
        throw new Error('no appointment found')
    }

    for (let item of items) {
        let appointment = await appointments.getById(item.id, req.context)

        await appointments.update(item, appointment, req.context)
    }

    log.end()
    return 'appointments successfully updated'
}
