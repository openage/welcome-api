'use strict'

const logger = require('@open-age/logger')('services/agents')
const db = require('../models')
const updateScheme = require('../helpers/updateEntities')

const update = async (model, agent) => {
    logger.start('update')
    updateScheme.update(model, agent)
    return agent.save()
}

const getByIdOrContext = async (id, context) => {
    context.logger.start('getByIdOrContext')

    let query = {}

    if (id) {
        query._id = id
    } else {
        query.user = context.user.id
        query.organization = context.organization.id
    }

    return db.agent.findOne(query).populate('organization user')
}

const create = async (model, context) => {
    let log = logger.start('services/agents:create')
    if (!model.user) {
        model.user = context.user.id
    }

    if (model.user) {
        model.searchData = {}
        model.searchData.phone = model.user.phone
        model.searchData.email = model.user.email
        model.searchData.name = `${model.user.firstName} ${model.user.lastName}`
    }

    if (!model.organization) {
        model.organization = context.organization
    }

    let agent = await db.agent.findOrCreate({
        user: context.user.id,
        organization: context.organization.id
    }, model)

    log.end()
    return getByIdOrContext(agent.result.id, context)
}

const get = async (query, context) => {
    let log = context.logger.start('services:agents:get')
    let agent = null
    if (!query) {
        return null
    } else if (typeof query === 'string') {
        agent = query.isObjectId()
            ? db.agent.findById(query)
            : db.agent.findOne({
                'user.role.code': query
            })
    } else if (query.id) {
        agent = db.agent.findById(query.id)
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
            agent = db.agent.findOne({
                'user._id': userId
            })
        } else if (roleId) {
            agent = db.agent.findOne({
                'user.role.id': roleId
            })
        } else if (roleCode) {
            agent = db.agent.findOne({
                'user.role.code': roleCode
            })
        }
    }

    log.end()

    return agent ? agent.lean().populate('organization user') : null
}

const getOrCreate = async (id, context) => {
    let log = context.logger.start('services:agents:getOrCreate')

    let agent = await getByIdOrContext(id, context)

    if (!agent) {
        agent = await create({
            user: context.user,
            organization: context.organization
        }, context)
    }

    log.end()
    return agent
}

exports.getOrCreate = getOrCreate
exports.get = get
exports.create = create

exports.update = update
exports.getByIdOrContext = getByIdOrContext
