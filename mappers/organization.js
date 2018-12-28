'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        shortName: entity.shortName,
        type: entity.type,
        activationKey: entity.activationKey,
        created_At: entity.created_At
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
