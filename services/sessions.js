'use strict'

// const firebase = require('../providers/firebase')
const logger = require('@open-age/logger')('service/sessions')
const db = require('../models')
const appointmentService = require('./appointments')
const userService = require('./users')

const create = async (model, context) => {
    let log = context.logger.start('services/sessions:create')
    let session = await new db.session({
        tenant: context.tenant,
        device: model.device,
        app: model.app,
        role: {
            key: model.key
        },
        appointment: model.appointment,
        status: 'awaiting'
    }).save()
    log.end()
    return session
}

const update = async (model, sessionId, context) => {
    let log = context.logger.start('services:sessions:update')

    let session = await db.session.findById(sessionId)
    session.appointment = await appointmentService.getById(model.appointment.id, context)
    session.user = await userService.get({
        role: model.role
    }, context)
    session.status = model.status || 'active'

    session.save()

    log.end()

    return session
}

exports.get = async (id, context) => {
    const log = logger.start('services/session:get')
    const session = await db.session.findById(id).populate({
        path: 'appointment user',
        populate: {
            path: 'agent visitor',
            populate: {
                path: 'user role'
            }
        }
    })
    log.end()
    return session
}
exports.create = create
exports.update = update