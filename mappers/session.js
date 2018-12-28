'use strict'

exports.toModel = entity => {
    var model = {
        user: entity.user,
        userToken: entity.userToken,
        roles: entity.roles,
        status: entity.status
    }
    return model
}
exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
