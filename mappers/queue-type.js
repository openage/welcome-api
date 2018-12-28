'use strict'

exports.toModel = entity => {
    var model = {
        code: entity.code,
        purpose: entity.purpose,
        maxQueueSize: entity.maxQueueSize,
        schedule: entity.schedule,
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
