'use strict'

const updateScheme = require('../helpers/updateEntities')
const offline = require('@open-age/offline-processor')
const ObjectId = require('mongodb').ObjectID
const db = require('../models')
const moment = require('moment-timezone')
const bapInvoiceProvider = require('../providers/bap/invoice')

const generateInvoice = async (appointment, context) => {   // create invoice on bap service
    let log = context.logger.start('services/appointments:generateInvoice')
    let agentRoleKey = appointment.agent.user.role.key

    let agentAvailability = await db.availability.findOne({
        agent: appointment.agent,
        type: appointment.queueType
    })

    let invoice = await bapInvoiceProvider.create({
        order: {
            id: appointment.id
        },
        lineItems: [{
            entity: {
                entityId: appointment.id,
                name: 'appointment',
                type: {
                    code: `${appointment.queueType.name}:${appointment.queueType.id}`,
                    qualifier: {
                        key: 'agent',
                        value: appointment.agent.id,
                        condition: 'eq'
                    }
                },
                consumption: {
                    quantity: agentAvailability.appointment.duration,
                    from: appointment.from,
                    till: appointment.till
                },
                qualifier: {
                    key: 'agent',
                    value: appointment.agent.id,
                    condition: 'eq'
                },
            }
        }],
        buyer: {
            role: appointment.visitor.user.role
        },
        service: {
            code: 'welcome'
        }
    }, agentRoleKey, context)

    log.end()
    return invoice
}

const create = async (model, context) => {
    let log = context.logger.start('create')

    if (!model.visitor) {
        model.visitor = context.visitor
    }
    let appointment = await new db.appointment(model)

    let invoice = await generateInvoice(appointment, context)

    appointment.invoice = {
        id: invoice.id
    }

    await appointment.save()

    let queueModel = {
        isProcessing: true
    }
    context.processSync = true
    queueModel.id = appointment.id
    offline.queue('appointment', 'create', { id: appointment.id, isProcessing: true }, context)
    offline.queue('agent', 'summary', { id: appointment.agent.id, isProcessing: true, date: appointment.from }, context)

    log.end()
    return appointment
}

const update = async (model, appointment, context) => {
    let log = context.logger.start('services/appointments:update')

    if (model.purpose) {
        appointment.purpose = model.purpose
    }

    if (model.from) {
        appointment.from = model.from
    }

    if (model.till) {
        appointment.till = model.till
    }

    if (model.status) {
        appointment.status = model.status
    }

    await appointment.save()

    if (model.status) {
        context.processSync = true
        await offline.queue('appointment', model.status, { id: appointment.id }, context)
    }

    log.end()
    return appointment
}

const getById = async (id, context) => {
    context.logger.start('getById')

    return db.appointment.findById(id).populate('agent visitor organization')
}

const visitorAppointments = async (userId, query, sortQuery, context) => {
    let log = context.logger.start('visitorAppointments fetching ..')
    let orgQuery = {}
    if (context.organization) {
        orgQuery.organization = ObjectId(context.organization.id)
    }

    const appointments = await db.appointment.aggregate([{
        $match: orgQuery
    }, {
        $match: query
    }, {
        $lookup: {
            from: 'visitors',
            localField: 'visitor',
            foreignField: '_id',
            as: 'visitor_doc'
        }
    }, { $unwind: '$visitor_doc' }, {
        $match: {
            'visitor_doc.user': ObjectId(userId)
        }
    }, {
        $lookup: {
            from: 'organizations',
            localField: 'organization',
            foreignField: '_id',
            as: 'org_doc'
        }
    }, {
        $lookup: {
            from: 'agents',
            localField: 'agent',
            foreignField: '_id',
            as: 'agent_doc'
        }
    }, { $unwind: '$org_doc' }, { $unwind: '$agent_doc' },
    {
        $lookup: {
            from: 'users',
            localField: 'agent_doc.user',
            foreignField: '_id',
            as: 'agent_user_doc'
        }

    }, {
        $unwind: '$agent_user_doc'
    }, {
        $sort: sortQuery
    }
    ])

    log.end()

    return appointments
}

const agentAppointments = async (query, context) => {
    let log = context.logger.start('agent appointment fetching...')

    if (!query.agent) {
        query.agent = context.agent.id
    }

    log.end()

    return db.appointment.find(query).sort({ from: -1 })
        .populate({
            path: 'visitor',
            populate: {
                path: 'user'
            }
        })
}

const futureAppointments = async (query, context) => {
    let log = context.logger.start('services/appointments:futureAppointments')
    let where = {}

    if (query.agentId) {
        where.agent = query.agentId
    }

    if (query.visitorId) {
        where.visitor = query.visitorId
    }

    where.from = {
        $gte: query.date ? query.date : moment().toDate()
    }

    where.status = {
        $in: query.status ? Array.isArray(query.status) ? query.status : [query.status] : ['scheduled', 'rescheduled']
    }

    let appointmentList = await db.appointment.find(where)
    log.end()
    return appointmentList
}

const oneDayAppointmentCount = async (query, context) => {
    context.logger.start('services/appointment:appointmentCount')

    let date = query.date || new Date()

    let startTime = moment(date).startOf('day')
    let endTime = moment(date).endOf('day')

    let where = {
        from: {
            $gte: startTime
        },
        till: {
            $lte: endTime
        },
        status: {
            $in: ['scheduled', 'rescheduled']
        }
    }

    if (query.agentId) {
        where.agent = query.agentId
    }

    if (query.visitorId) {
        where.visitor = query.visitorId
    }

    return db.appointment.find(where).count()
}

exports.create = create
exports.getById = getById
exports.update = update
exports.visitorAppointments = visitorAppointments
exports.agentAppointments = agentAppointments
exports.futureAppointments = futureAppointments
exports.oneDayAppointmentCount = oneDayAppointmentCount
