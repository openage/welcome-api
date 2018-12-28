'use strict'

exports.toModel = entity => {
    var model = {
        account: entity.account,
        mode: entity.mode,
        date: entity.date,
        status: entity.status
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
