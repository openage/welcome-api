'use strict'

const updateScheme = require('../helpers/updateEntities')

const offline = require('@open-age/offline-processor')

const organizationService = require('./organizations')

const tenantService = require('./tenants')

const db = require('../models')

const set = (entity, model, context) => {
    if (model.role) {
        entity.role = updateScheme.update(model.role, entity.role)
    }

    if (model.phone) {
        entity.phone = model.phone
    }

    if (model.email) {
        entity.email = model.email
    }

    if (model.firstName) {
        entity.firstName = model.firstName
    }

    if (model.lastName) {
        entity.lastName = model.lastName
    }

    if (model.dob) {
        entity.dob = model.dob
    }

    if (model.gender) {
        entity.gender = model.gender
    }

    if (model.pic) {
        entity.pic = updateScheme.update(model.pic, entity.pic)
    }

    if (model.isPhoneValidate) {
        entity.isPhoneValidate = model.isPhoneValidate
    }

    if (model.isEmailValidate) {
        entity.isEmailValidate = model.isEmailValidate
    }

    if (model.isProfileComplete) {
        entity.isProfileComplete = model.isProfileComplete
    }

    return entity
}

const update = async (model, user, context) => {
    let log = context.logger.start('services:users:update')
    user = set(user, model, context)

    context.processSync = true
    offline.queue('user', 'update', { id: user.id }, context)

    log.end()
    return user.save()
}

const create = async (model, context) => {
    let log = context.logger.start('services/users:create')

    if (!model.role && !model.role.id) {
        throw new Error('role required!')
    }

    let user = new db.user({
        _id: model._id ? global.toObjectId(model._id) : undefined,
        role: model.role,
        tenant: context.tenant
    })

    let profile = model.profile || {}

    user.email = model.email || undefined
    user.phone = model.phone || undefined
    user.firstName = profile.firstName || model.firstName || undefined
    user.lastName = profile.lastName || model.lastName || undefined
    user.dob = profile.dob || model.dob || undefined
    user.gender = profile.gender || model.gender || undefined

    let pic = profile.pic || model.pic || {}
    pic.url = pic.url || model.picUrl
    user.pic = pic

    log.end()
    return user.save()
}

const get = async (query, context) => {
    let log = context.logger.start('services/users:get')

    let user = null

    if (typeof query === 'string') {
        user = query.toObjectId()
            ? db.user.findById(query)
            : db.user.findOne({ 'role.code': query })
    }

    if (query.id) {
        user = db.user.findById(query.id)
    }

    if (query.role) {
        if (query.role.id) {
            user = db.user.findOne({ 'role.id': query.role.id })
        } else if (query.role.code) {
            user = db.user.findOne({ 'role.code': query.role.code })
        }
    }

    log.end()
    return user
}

const sync = async (data, context) => { // Here formal argument data contain role model of directory
    let log = context.logger.start('service/users:sync')

    if (!data || (data.id && data._id)) {
        throw new Error('role or role id not found')
    }

    let user = await db.user.findOne({ 'role.id': data._id || data.id })

    let tenant = await tenantService.getOrCreate((data.tenant), context)
    context.tenant = tenant

    let organization = null
    if (data.organization) {
        organization = await organizationService.get(data.organization, context)

        if (!organization) {
            organization = await organizationService.create({
                _id: data.organization.id,
                code: data.organization.code,
                name: data.organization.name,
                shortName: data.organization.shortName,
                address: data.organization.address,
                status: data.organization.status,
                type: data.organization.type
            }, context)
        }
    }

    let userModel = {
        _id: data._id || data.id,
        role: {
            id: data._id || data.id,
            key: data.key,
            code: data.code,
            permissions: data.permissions,
            organization: organization,
            user: data.user
        },
        email: data.user.email,
        phone: data.user.phone
    }

    let profile = data.user.profile || {}
    userModel.firstName = profile.firstName
    userModel.lastName = profile.lastName
    userModel.dob = profile.dob
    userModel.gender = profile.gender

    let pic = profile.pic || {}
    pic.url = pic.url || data.user.picUrl
    userModel.pic = pic

    userModel.isPhoneValidate = data.user.isPhoneValidate
    userModel.isEmailValidate = data.user.isEmailValidate
    userModel.isProfileComplete = data.user.isProfileComplete

    if (!user) {
        log.info('creating new user ... ')
        user = await create(userModel, context)
        log.info(`new user created ${user.id}`)
    } else {
        log.info(`updating user of id: ${user.id} ...`)
        user = await update(userModel, user, context)
        log.info(`user successfully updated`)
    }

    log.end()
    return user
}

exports.create = create
exports.get = get
exports.update = update
exports.sync = sync
