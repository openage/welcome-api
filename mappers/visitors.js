'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        data: entity.data,
        type: entity.type,
        profile: {}
    }

    if (entity.user._doc) {
        model.phone = entity.user.phone
        model.email = entity.user.email

        model.role = {
            id: entity.user.role.id,
            code: entity.user.role.code
        }

        model.profile = {
            firstName: entity.user.firstName,
            lastName: entity.user.lastName,
            dob: entity.user.dob,
            gender: entity.user.gender
        }

        if (entity.user.pic) {
            model.profile.pic = {
                url: entity.user.pic.url,
                thumbnail: entity.user.pic.thumbnail
            }
        } else {
            model.profile.pic = {
                url: entity.user.picUrl
            }
        }

        model.isPhoneValidate = entity.user.isPhoneValidate
        model.isEmailValidate = entity.user.isEmailValidate
        model.isProfileComplete = entity.user.isProfileComplete
    }


    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name,
            shortName: entity.organization.shortName,
            address: entity.organization.address
        } : {
                id: entity.organization.toString()
            }
    }
    return model
}
exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
