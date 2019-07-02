'use strict'

const logger = require('@open-age/logger')('services/availabilities')
const offline = require('@open-age/offline-processor')
const db = require('../models')

let moment = require('moment-timezone')
const agentService = require('./agents')
const queueTypeService = require('./queue-types')


const sortScheduleTime = (schedule) => {
    if (!schedule) {
        return schedule
    }

    function arrange(periods) {
        if (periods.length <= 1) {
            return periods
        }
        periods = periods.map((period) => {
            return {
                startTime: moment().set('hour', moment(period.startTime).hour())
                    .set('minute', moment(period.startTime).minutes())
                    .set('second', moment(period.startTime).seconds()).toDate(),
                endTime: moment().set('hour', moment(period.endTime).hour())
                    .set('minute', moment(period.endTime).minutes())
                    .set('second', moment(period.endTime).seconds()).toDate()
            }
        })
        return periods.sort((period1, period2) => moment(period1.startTime).diff(moment(period2.startTime)))
    }

    for (let property in schedule) {
        if (property !== 'activeCamps') {
            let periods = schedule[property]
            schedule[property] = arrange(periods)
        }
    }

    return schedule
}

const create = async (model, context) => {
    let log = context.logger.start('create availability')

    let agent

    let type = await queueTypeService.getOrCreate({
        name: model.type.name,
        organization: context.organization
    }, context)

    if (!type) {
        throw new Error(`Queue type of name: ${model.type.name} does not exist`)
    }

    if (!model.agent) {
        agent = await agentService.create({   // creating agent if not exist
            user: context.user.id,
            organization: context.organization
        }, context)
    } else {
        agent = await agentService.get(model.agent, context)
    }

    if (!agent) {
        throw new Error('Agent not found')
    }

    let availability = await db.availability.findOne({
        type: type,
        agent: agent
    })

    if (availability) {
        return update(model, availability, context)
    }

    let schedule = sortScheduleTime(model.schedule)

    availability = await new db.availability({
        appointment: model.appointment,
        periodicity: model.periodicity,
        status: model.status,
        schedule: schedule,
        type: type,
        agent: agent
    }).save()

    let queueTypeId = availability.type._doc ? availability.type.id : availability.type.toString()

    context.processSync = true
    offline.queue('queue-type', 'sync', { id: queueTypeId }, context)
    offline.queue('availability', 'sync', availability, context)

    log.end()
    return availability
}

const getById = async (id, context) => {
    logger.start('getById')
    return db.availability.findById(id)
}

const update = async (data, availability, context) => {
    let log = context.logger.start('services:availabilities:update')

    if (data.schedule) {
        availability.schedule = sortScheduleTime(data.schedule)
    }

    if (data.appointment) {
        availability.appointment = data.appointment
    }

    if (data.periodicity) {
        availability.periodicity = data.periodicity
    }

    if (data.appointmentFee) {
        availability.appointmentFee = data.appointmentFee
    }

    await availability.save()

    context.processSync = true
    offline.queue('queue-type', 'sync',
        { id: availability.type_doc ? availability.type.id : availability.type.toString() },
        context)

    await offline.queue('availability', 'sync', availability, context)

    log.end()
    return availability
}

const getByAgent = async (agentId) => {
    return db.availability.findOne({ agent: agentId })
}

const get = async (query, context) => {
    let log = context.logger.start('services:availabilities:get')

    let availability

    if (typeof query === 'string' && query.isObjectId()) {
        availability = db.availability.findById(query)
    }

    if (query.id) {
        availability = db.availability.findById(query.id)
    }

    if (query.agentId) {
        availability = db.availability.findOne({ agent: query.agentId })
    }

    // if (!availability && (query.agentId || context.agent)) {
    //     return create({
    //         agent: query.agentId || context.agent,
    //         organization: context.organization
    //     })
    // }

    return availability ? availability.populate('organization').populate({
        path: 'agent',
        populate: {
            path: 'user'
        }
    }) : null
}

exports.create = create
exports.getById = getById
exports.update = update
exports.getByAgent = getByAgent
exports.get = get
