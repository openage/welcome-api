'use strict'

const create = async (model, context) => {
    context.logger.start('services/tenants:create')
}

const get = async (query, context) => {
    let log = context.logger.start('services/tenants:get')
    let tenant
    if (typeof query === 'string') {
        if (query.toObjectId()) {
            tenant = db.tenant.findById(query)
        } else {
            tenant = db.tenant.findOne({ code: query })
        }
    }

    if (query.id) {
        tenant = db.tenant.findById(query.id)
    }

    if (query.code) {
        tenant = db.tenant.findOne({ code: query.code })
    }

    log.end()
    return tenant ? tenant.populate('owner') : null
}


const getOrCreate = async (model, context) => {
    let log = context.logger.start('services/tenants:getOrCreate')

    let tenant = await get(model, context)

    if (!tenant) {
        tenant = await create(model, context)
    }

    log.end()

    return tenant
}

exports.create = create
exports.getOrCreate = getOrCreate
exports.get = get
