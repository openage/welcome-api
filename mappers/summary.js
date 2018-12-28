'use strict'

exports.toModel = entity => {
    var model = {
        date: entity.date
    }

    if (entity.appointments) {
        model.appointments = {
            status: entity.appointments.status
        }
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
