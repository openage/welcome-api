'use strict'

const logger = require('@open-age/logger')('services/availabilities')
const offline = require('@open-age/offline-processor')
const updateScheme = require('../helpers/updateEntities')
const db = require('../models')

const create = async (model, context) => {
    logger.start('create availability')

    let availability = null

    if (!model.agent) {
        model.agent = context.agent.id
    }

    availability = await getByAgent(model.agent)

    if (availability) {
        return update(model, availability, context)
    }

    availability = await new db.availability(model).save()

    let queueTypeId = availability.type._doc ? availability.type.id : availability.type.toString()

    context.processSync = true
    offline.queue('queue-type', 'sync',
        { id: queueTypeId }, context)

    await offline.queue('availability', 'sync', availability, context)

    return availability
}

const getById = async (id, context) => {
    logger.start('getById')
    return db.availability.findById(id)
}

const update = async (data, availability, context) => {
    let log = context.logger.start('services:availabilities:update')

    if (data.schedule) {
        availability.schedule = data.schedule
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
