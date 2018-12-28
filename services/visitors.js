'use strict'

const updateScheme = require('../helpers/updateEntities')
const logger = require('@open-age/logger')('validators/visitors')
const db = require('../models')
const userService = require('./users')

const create = async (model, context) => {
    let log = context.logger.start('services/visitors:create')

    if (!model.user) { throw new Error('user required') }
    if (!model.organization) { throw new Error('organization required') }

    if (model.user) {
        model.searchData = {}
        model.searchData.phone = model.user.phone
        model.searchData.email = model.user.email
        model.searchData.name = `${model.user.firstName} ${model.user.lastName}`
    }

    let visitor = await new db.visitor(model).save()

    return db.visitor.findById(visitor.id).populate('user organization')
}

const update = async (model, visitor) => {
    logger.start('update')
    updateScheme.update(model, visitor)
    return visitor.save()
}

const getByIdOrContext = async (id, context) => {
    let log = logger.start('getByIdOrContext')

    let query = {}

    if (id) {
        query._id = id
    } else {
        query.user = context.user.id
    }

    log.end()
    return db.visitor.findOne(query).populate('organization user')
}

const get = async (query, context) => {
    let log = context.logger.start('services:visitors:get')
    let visitor = null
    if (!query) {
        return null
    } else if (typeof query === 'string') {
        visitor = query.isObjectId()
            ? db.visitor.findById(query)
            : db.visitor.findOne({
                'user.role.code': query
            })
    } else if (query.id) {
        visitor = db.visitor.findById(query.id)
    } else {
        let roleCode = query.code || query.uniqueCode || query.roleCode || (query.role && query.role.code)

        if (query.role && query.role.code) {
            roleCode = query.role.code
        }

        let roleId = query.roleId || query.uId || query.uniqueId || query.qrCode || (query.role && query.role.id)

        if (query.role && query.role.id) {
            roleId = query.role.id
        }

        let userId = query.userId
        if (query.user && query.user.id) {
            userId = query.user.id
        }

        if (userId) {
            visitor = db.visitor.findOne({
                'user': userId
            })
        } else if (roleId) {
            visitor = db.visitor.findOne({
                'user.role.id': roleId
            })
        } else if (roleCode) {
            visitor = db.visitor.findOne({
                'user.role.code': roleCode
            })
        }
    }

    log.end()

    return visitor ? visitor.lean().populate('organization user') : null
}

const findOrCreate = async (data, context) => {
    let log = context.logger.start('services/visitors:findOrCreate')

    let visitor = null
    let user = null

    if (data.id) {
        visitor = await db.visitor.findById(data.id).populate('user')
    } else if (data.role) {
        user = await userService.get({ role: data.role }, context)
        if (!user) {
            user = await userService.create(data, context)
        }
    } else {
        user = data.user || req.context.user
    }

    if (!user) { throw new Error('user required to create visitor') }

    let organization = data.organization || context.organization

    if (!organization) { throw new Error('organization required') }

    visitor = await db.visitor.findOne({
        user: user,
        organization: organization
    }).populate('user')

    if (!visitor) {
        visitor = await create({
            user: user,
            organization: organization
        }, context)
    }

    log.end()
    return visitor
}

exports.get = get
exports.create = create
exports.getByIdOrContext = getByIdOrContext
exports.update = update
exports.findOrCreate = findOrCreate
