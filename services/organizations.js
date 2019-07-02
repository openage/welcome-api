'use strict'

const db = require('../models')

const updateScheme = require('../helpers/updateEntities')

const update = async (data, organizationId, context) => {
    let log = context.logger.start('services:organizations:update')

    let model = {
        code: data.code,
        name: data.name,
        shortName: data.shortName,
        type: data.type,
        address: data.address,
        status: data.status
    }

    let organization = await db.organization.findById(organizationId)

    log.end()
    return updateScheme.update(model, organization).save()
}

const create = async (data, context) => {
    let log = context.logger.start('services/organizations:create')

    let organization = new db.organization({
        _id: data._id ? global.toObjectId(data._id) : undefined,
        name: data.name,
        code: data.code,
        shortName: data.shortName,
        type: data.type,
        address: data.address,
        status: data.status,
        tenant: context.tenant
    }).save()

    log.end()
    return organization
}

const get = async (query, context) => {
    let log = context.logger.start('services/organizations:get')

    if (!query) {
        return null
    }

    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.organization.findById(query)
        } else {
            return db.organization.findOne({ code: query })
        }
    }

    if (query.id) {
        return db.organization.findById(query.id)
    }

    if (query.code) {
        return db.organization.findOne({ code: query.code })
    }

    log.end()
    return null
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start('services/organizations:getOrCreate')

    let organization = await get(data, context)

    if (!organization) {
        organization = await create(data, context)
    }

    log.end()
    return organization
}

exports.update = update
exports.getOrCreate = getOrCreate
exports.create = create
exports.get = get
