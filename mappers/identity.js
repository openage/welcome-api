'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        name: entity.name,
        organization: entity.organization
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
