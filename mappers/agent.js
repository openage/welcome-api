'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        data: entity.data,
        availability: entity.availability,
        vacations: entity.vacations,
        appointmentCount: entity.appointmentCount,
        profile: {}
    }

    if (entity.user) {
        model.picUrl = entity.user.picUrl // TODO: obsolete
        model.firstName = entity.user.firstName // TODO: obsolete
        model.lastName = entity.user.lastName // TODO: obsolete
        model.email = entity.user.email
        model.phone = entity.user.phone
        model.dob = entity.user.dob // TODO: obsolete
        model.gender = entity.user.gender // TODO: obsolete

        model.profile = {
            firstName: entity.user.firstName,
            lastName: entity.user.lastName,
            dob: entity.user.dob,
            gender: entity.user.gender
        }

        if (entity.user.pic || entity.user.picUrl) {
            let pic = entity.user.pic || {}
            pic.url = pic.url || entity.user.picUrl
            pic.thumbnail = pic.thumbnail
            model.profile.pic = pic
        }
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            name: entity.organization.name,
            code: entity.organization.code,
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
