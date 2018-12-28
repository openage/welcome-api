'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        email: entity.email,
        phone: entity.phone,
        dob: entity.dob,
        gender: entity.gender,
        isSearchable: entity.isSearchable,
        isVisitor: entity.isVisitor,
        identities: entity.identities,
        organization: entity.organization,
        type: entity.type,
        availability: entity.availability
    }

    model.profile = {
        firstName: entity.user.firstName,
        lastName: entity.user.lastName,
        dob: entity.user.dob,
        gender: entity.user.gender,
        pic: {
            url: entity.user.picUrl
        }
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
