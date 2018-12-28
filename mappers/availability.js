'use strict'

exports.toModel = (entity) => {
    var model = {
        id: entity.id || entity._id.toString(),
        status: entity.status,
        schedule: entity.schedule,
        appointment: entity.appointment,
        appointmentFee: entity.appointmentFee,
        periodicity: entity.periodicity
    }

    if (entity.agent) {
        if (entity.agent._doc) {
            model.agent = {
                id: entity.agent.id
            }
            if (entity.agent.user._doc) {
                model.agent.firstName = entity.agent.user.firstName //TODO: obsolete
                model.agent.lastName = entity.agent.user.lastName  //TODO: obsolete
                model.agent.picUrl = entity.agent.user.picUrl   //TODO: obsolete
                model.agent.profile = {
                    firstName: entity.agent.user.firstName,
                    lastName: entity.agent.user.lastName,
                    pic: entity.agent.user.pic ? entity.agent.user.pic : { url: entity.agent.user.picUrl }
                }
                model.agent.role = {
                    id: entity.agent.user.role.id
                }
            }
        } else {
            model.agent = {
                id: entity.agent.toString()
            }
        }
    }

    return model
}

exports.toSearchModel = (entities) => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
