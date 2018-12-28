'use strict'

exports.toModel = (entity) => {
    var model = {
        from: entity.start,
        till: entity.end,
        status: entity.status
    }

    if (entity.visitor) {
        model.visitor = entity.visitor._doc ? entity.visitor.user._doc ? {
            id: entity.visitor.id,
            role: {
                id: entity.visitor.user.role.id,
                code: entity.visitor.user.role.code
            },
            profile: {
                firstName: entity.visitor.user.firstName,
                lastName: entity.visitor.user.lastName,
                pic: entity.visitor.user.pic ? entity.visitor.user.pic : {
                    url: entity.visitor.user.picUrl
                }
            }
        } : {
                id: entity.visitor.id
            } : {
                id: entity.visitor.toString()
            }
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
