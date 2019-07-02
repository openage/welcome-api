'use strict'

const contextBuilder = require('./context-builder')
const directory = require('../providers/directory')
const db = require('../models')
const userService = require('../services/users')
const organizationService = require('../services/organizations')

const fetch = (req, modelName, paramName) => {
    var value = req.query[`${modelName}-${paramName}`] || req.headers[`x-${modelName}-${paramName}`]
    if (!value && req.body[modelName]) {
        value = req.body[modelName][paramName]
    }
    if (!value) {
        return null
    }

    var model = {}
    model[paramName] = value
    return model
}

const setContextByUser = async (user, logger) => {
    let organization = null
    if (user.role && user.role.organization) {
        organization = await organizationService.get(user.role.organization, { logger: logger })
    }

    return contextBuilder.create({
        user: user,
        organization: organization,
        tenant: user.tenant
    }, logger)
}

const extractRoleKey = async (roleKey, logger) => {
    let log = logger.start('extractRoleKey')

    let user = await db.user.findOne({ 'role.key': roleKey }).populate('tenant')
    if (user) {
        return setContextByUser(user, logger)
    }

    log.debug('key does not exit, checking with directory')
    let role = await directory.getRole(roleKey)

    if (!role) {
        throw new Error('invalid role key')
    }

    log.debug('got the data from directory, synchronizing it')

    user = await db.user.findOne({ 'role.id': role.id }).populate('tenant')

    if (user) {
        return setContextByUser(user, logger)
    }

    user = await userService.sync(role, { logger: logger })

    return setContextByUser(user, logger)
}

const requiresRoleKey = (req, res, next) => {
    let log = res.logger.start('requiresRoleKey')
    var role = fetch(req, 'role', 'key')

    if (!role) {
        log.end()
        return res.accessDenied('x-role-key is required.', 403)
    }

    log.debug(`x-role-key: ${role.key}`)

    extractRoleKey(role.key, res.logger).then((context) => {
        if (!context) {
            log.error('context could not be created')
            return res.accessDenied('invalid user', 403)
        }
        context.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        req.context = context
        next()
    }).catch(err => {
        log.error(err)
        log.end()
        res.accessDenied('invalid user', 403)
    })
}

exports.requiresTenantCode = (req, res, next) => {
    var tenant = fetch(req, 'tenant', 'code')
    if (!tenant) {
        return res.accessDenied('x-tenant-code is required')
    }

    contextBuilder.create({
        tenant: tenant
    }, res.logger).then(context => {
        if (!context.tenant) {
            return res.accessDenied(`invalid x-tenant-code: '${tenant.code}'`)
        }
        req.context = context
        next()
    }).catch(err => res.accessDenied(err))
}

exports.requiresRoleKey = requiresRoleKey
