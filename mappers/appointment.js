'use strict'

exports.toModel = entity => {
    var model = {
        id: entity.id,
        purpose: entity.purpose,
        from: entity.from || entity.start,
        till: entity.till || entity.end,
        token: entity.token,
        status: entity.status
    }

    if (entity.invoice) {
        model.invoice = {
            id: entity.invoice.id
        }
    }

    if (entity.agent) {
        if (entity.agent._doc) {
            model.agent = {
                id: entity.agent.id
            }
            if (entity.agent.user._doc) {
                model.agent.firstName = entity.agent.user.firstName
                model.agent.lastName = entity.agent.user.lastName
                model.agent.picUrl = entity.agent.user.picUrl
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

    if (entity.visitor) {
        model.visitor = entity.visitor._doc ? entity.visitor.user._doc ? {
            id: entity.visitor.id,
            firstName: entity.visitor.user.firstName, // TODO: obsolete
            lastName: entity.visitor.user.lastName, // TODO: obsolete
            picUrl: entity.visitor.user.picUrl, // TODO: obsolete
            roleId: entity.visitor.user.role.id, // TODO: obsolete
            role: {
                id: entity.visitor.user.role.id,
                code: entity.visitor.user.role.code
            },
            profile: {
                firstName: entity.visitor.user.firstName,
                lastName: entity.visitor.user.lastName,
                pic: entity.visitor.user.pic ? entity.visitor.user.pic : { url: entity.visitor.user.picUrl }
            }
        } : {
                id: entity.visitor.id
            } : {
                id: entity.visitor.toString()
            }
    }

    if (entity.organization) {
        if (entity.organization._doc) {
            model.organization = {
                id: entity.organization.id,
                code: entity.organization.code,
                name: entity.organization.name,
                shortName: entity.organization.shortName
            }
        } else {
            model.organization = {
                id: entity.organization.toString()
            }
        }
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}

exports.toVisitorAppointment = entity => {
    var model = {
        id: entity.id || entity._id.toString(),
        purpose: entity.purpose,
        from: entity.from,
        till: entity.till,
        token: entity.token,
        status: entity.status
    }

    if (entity.agent_doc) {
        model.agent = {
            id: entity.agent_doc.id || entity.agent_doc._id.toString()
        }
        if (entity.agent_user_doc) {
            model.agent.firstName = entity.agent_user_doc.firstName // TODO: obsolete
            model.agent.lastName = entity.agent_user_doc.lastName // TODO: obsolete
            model.agent.profile = {
                firstName: entity.agent_user_doc.firstName,
                lastName: entity.agent_user_doc.lastName,
                pic: entity.agent_user_doc.pic ? entity.agent_user_doc.pic : { url: entity.agent_user_doc.picUrl }
            }
            model.agent.role = {
                id: entity.agent_user_doc.role.id
            }
        }
    }

    if (entity.org_doc) {
        model.organization = {
            id: entity.org_doc.id || entity.org_doc._id.toString(),
            name: entity.org_doc.name,
            code: entity.org_doc.code
        }
    }

    return model
}

exports.toVisitorAppointments = entities => {
    return entities.map(entity => {
        return exports.toVisitorAppointment(entity)
    })
}
