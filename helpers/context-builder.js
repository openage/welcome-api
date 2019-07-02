'use strict'
const db = require('../models')
const create = async (claims, logger) => {
    let context = {
        logger: logger || claims.logger || require('@open-age/logger'),
        user: claims.user,
        agent: claims.agent,
        visitor: claims.visitor,
        organization: claims.organization
    }

    let log = context.logger.start('context-builder:create')
    if (claims.tenant && claims.tenant._doc) {
        context.tenant = claims.tenant
    } else if (claims.tenant && claims.tenant.id) {
        context.tenant = await db.tenant.findOne({ _id: claims.tenant.id }).populate('owner')
    } else if (claims.tenant && claims.tenant.code) {
        context.tenant = await db.tenant.findOne({ code: claims.tenant.code }).populate('owner')
    } else if (claims.tenant && claims.tenant.key) {
        context.tenant = await db.tenant.findOne({ key: claims.tenant.key }).populate('owner')
    }
    context.log = context.logger

    context.permissions = context.agent && context.agent.role.permissions
        ? context.user.role.permissions : []

    context.hasPermission = (permission) => {
        return context.permissions.find(permission)
    }

    context.where = () => {
        let clause = {}

        if (context.organization) {
            clause.organization = context.organization.id.toObjectId()
        }

        if (context.agent) {
            clause.agent = context.agent.id.toObjectId()
        }

        let filters = {}

        filters.add = (field, value) => {
            if (value) {
                clause[field] = value
            }
            return filters
        }

        filters.clause = clause

        return filters
    }

    log.end()
    return context
}
exports.create = create
