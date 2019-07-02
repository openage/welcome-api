'use strict'

const appointment = require('./appointment')
const user = require('./user')

exports.toModel = (entity) => {
    const model = {
        id: entity.id,
        purpose: entity.purpose,
        device: entity.device,
        status: entity.status,
        app: entity.app,
        timeStamp: entity.timeStamp,
        appointment: entity.appointment ? appointment.toModel(entity.appointment) : undefined,
        user: entity.user ? user.toModel(entity.user) : undefined
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
