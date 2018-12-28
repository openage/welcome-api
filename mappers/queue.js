'use strict'

exports.toModel = entity => {
    var model = {
        date: entity.date,
        currentToken: entity.currentToken,
        lastToken: entity.lastToken,
        type: entity.type,
        status: entity.status,
        agents: entity.agents,
        organization: entity.organization
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
