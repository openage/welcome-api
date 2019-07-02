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

    if (entity.type) {
        if (entity.type._doc) {
            model.type = {
                name: entity.type.name,
                purpose: entity.type.purpose,
                maxQueueSize: entity.type.maxQueueSize,
                schedule: entity.type.schedule,
                status: entity.type.status
            }
        } else {
            model.type = {
                id: entity.type.toString()
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
