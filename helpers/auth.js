'use strict'

const contextBuilder = require('./context-builder')
const directory = require('../providers/directory')
const db = require('../models')
const tenantService = require('../services/tenants')

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
        organization = await db.organization.findById(user.role.organization.id)
    }

    return contextBuilder.create({
        user: user,
        organization: organization
    }, logger)
}

const extractRoleKey = async (roleKey, logger) => {
    let log = logger.start('extractRoleKey')

    let user = await db.user.findOne({ 'role.key': roleKey })
    if (user) {
        return setContextByUser(user, logger)
    }

    log.debug('key does not exit, checking with directory')
    let role = await directory.getRole(roleKey)

    if (!role) {
        throw new Error('invalid role key')
    }

    log.debug('got the data from directory, synchronizing it')


    user = await db.user.findOne({ 'role.id': role.id })
    if (user) {
        return setContextByUser(user, logger)
    }

    let tenant = await tenantService.getOrCreate(role.tenant, { logger: logger })

    let organization = null
    if (role.organization) {
        organization = (await db.organization.findOrCreate({ code: role.organization.code }, {
            _id: toObjectId(role.organization.id),
            name: role.organization.name,
            code: role.organization.code,
            shortName: role.organization.shortName,
            type: role.organization.type,
            address: role.organization.address,
            status: role.organization.status,
            tenant: tenant.id
        })).result
    }

    user = await new db.user({
        _id: toObjectId(role.id),
        role: {
            id: role.id,
            key: role.key,
            code: role.code,
            permissions: role.permissions,
            organization: role.organization
        },
        authId: role.user.id,
        email: role.user.email,
        phone: role.user.phone,
        picUrl: role.user.picUrl,
        firstName: role.user.profile.firstName,
        lastName: role.user.profile.lastName,
        gender: role.user.profile.gender,
        pic: role.user.profile.pic,
        dob: role.user.profile.dob,
        organization: organization,
        tenant: tenant.id
    }).save()

    // if (role.organization.owner === role.id) {
    //     organization.owner = user
    //     await organization.save()
    // }

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

exports.requiresRoleKey = requiresRoleKey
