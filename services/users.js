'use strict'

const logger = require('@open-age/logger')('services/users')
const updateScheme = require('../helpers/updateEntities')
const offline = require("@open-age/offline-processor")
const organizationService = require('./organizations')

const update = async (model, user, context) => {
    context.logger.start('services:users:update')
    updateScheme.update(model, user)

    context.processSync = true
    offline.queue('user', 'update', { id: user.id }, context)

    return user.save()
}

const updateByDirectory = async (data, context) => {
    let log = context.logger.start('services:users:updateByDirectory')

    if (!data) { return }

    let organization = null

    if (data.organization) {
        organization = await organizationService.get({
            code: data.organization.code
        }, context)

        if (!organization) {
            organization = await organizationService.create({
                id: data.organization.id,
                code: data.organization.code,
                address: data.organization.address,
                status: data.organization.status,
                type: data.organization.type
            }, context)
        }
    }

    let userModel = {
        role: {
            id: data._id,
            key: data.key,
            code: data.code,
            permissions: data.permissions
        },
        email: data.user.email,
        phone: data.user.phone
    }

    let profile = data.user.profile || {}
    userModel.firstName = profile.firstName
    userModel.lastName = profile.lastName
    userModel.dob = profile.dob
    userModel.gender = profile.gender

    userModel.pic = profile.pic || {}
    userModel.picUrl = userModel.pic.url || data.picUrl

    let user = await db.user.findOne({ 'role.id': data._id })
    if (!user) { return }

    return update(userModel, user, context)
}

const create = async (model, context) => {
    let log = context.logger.start('services/users:create')

    if (!model.role && !model.role.id) {
        throw new Error('role required!')
    }

    let user = new db.user({
        role: model.role
    })

    let profile = model.profile || {}

    user.email = model.email || undefined
    user.phone = model.phone || undefined
    user.firstName = profile.firstName || model.firstName || undefined
    user.lastName = profile.lastName || model.lastName || undefined
    user.dob = profile.dob || model.dob || undefined
    user.gender = profile.gender || model.gender || undefined

    let pic = profile.pic || {}
    user.picUrl = pic.url || model.picUrl || undefined

    return user.save()
}

const get = async (query, context) => {
    let log = context.logger.start("services/users:get")

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

    return user ? user : null

}

exports.create = create
exports.get = get
exports.update = update
exports.updateByDirectory = updateByDirectory
