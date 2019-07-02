'use strict'

const logger = require('@open-age/logger')('services/queue-types')
const updateScheme = require('../helpers/updateEntities')
const db = require('../models')

const dateHelper = require('../helpers/dates')

const create = async (model, context) => {
    logger.start('create')

    if (!model.organization) {
        model.organization = context.organization.id
    }

    return new db.queueType(model).save()
}

const update = async (queueType, model, context) => {
    logger.start('update')

    return updateScheme.update(model, queueType).save()
}

const sync = async (id, context) => {
    let log = context.logger.start('services/queue-type:sync')
    let queueType = await db.queueType.findById(id)

    // get all the availabilities for this queue type
    let availabilities = await db.availability.find({
        type: queueType
    })

    queueType.schedule = queueType.schedule || {}

    dateHelper.days.forEach(day => {
        queueType.schedule[day] = queueType.schedule[day] || {}
    })

    const getStartTime = (availability, day) => {
        availability.schedule[day] = availability.schedule[day] || []
        let startTime

        availability.schedule[day].forEach(item => {
            if (dateHelper.time(item.startTime).lt(startTime) || !startTime) {
                startTime = item.startTime
            }

        })

        return startTime
    }

    const getEndTime = (availability, day) => {
        availability.schedule[day] = availability.schedule[day] || []
        let endTime

        availability.schedule[day].forEach(item => {
            if (dateHelper.time(item.endTime).gt(endTime) || !endTime) {
                endTime = item.endTime
            }

        })

        return endTime
    }

    availabilities.forEach(availability => {
        dateHelper.days.forEach(day => {
            let availabilityStartTime = getStartTime(availability, day)
            let availabilityEndTime = getEndTime(availability, day)

            if (dateHelper.time(availabilityStartTime).lt(queueType.schedule[day].startTime)
                || (!queueType.schedule[day].startTime && availabilityStartTime)) {
                queueType.schedule[day].startTime = availabilityStartTime
            }

            if (dateHelper.time(availabilityEndTime).gt(queueType.schedule[day].endTime)
                || (!queueType.schedule[day].endTime && availabilityEndTime)) {
                queueType.schedule[day].endTime = availabilityEndTime
            }
        })
    })

    log.end()
    return queueType.save()
}

const getById = async (id, context) => {
    logger.start('getById')

    return db.queueType.findById(id)
}

const get = async (query, context) => {
    let log = context.logger.start('services:queue-type:get')

    let queueType = null

    if (typeof query === 'string') {
        if (query.isObjectId()) {
            queueType = db.queueType.findById(query)
        } else {
            queueType = db.queueType.findOne({
                name: queueType,
                organization: (context.organization).id
            })
        }
    }

    if (query.id) {
        queueType = db.queueType.findById(query.id)
    }

    if (query.name) {
        queueType = db.queueType.findOne({
            name: query.name,
            organization: context.organization.id
        })
    }

    return queueType
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start('services:queue-type:get')

    let queueType = await get(data, context)

    if (!queueType) {
        return create(data, context)
    }

    log.end()
    return queueType
}

exports.sync = sync
exports.create = create
exports.update = update
exports.getById = getById
exports.getOrCreate = getOrCreate
exports.get = get
