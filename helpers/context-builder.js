'use strict'

exports.create = (claims, logger) => {
    let context = {
        logger: logger || claims.logger || require('@open-age/logger'),
        user: claims.user,
        agent: claims.agent,
        visitor: claims.visitor,
        organization: claims.organization
    }

    let log = context.logger.start('context-builder:create')

    context.log = context.logger

    context.permissions = context.agent && context.agent.role.permissions
        ? context.user.role.permissions : []

    context.hasPermission = (permission) => {
        return context.permissions.find(permission)
    }
    log.end()
    return context
}
