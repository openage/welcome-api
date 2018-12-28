'use strict'

const agents = require('../services/agents')
const db = require('../models')

exports.canCreate = async (req) => {
    // todo only admin can create queue type
    if (!req.body.name) {
        return 'queue-type code is required!'
    }

    await agents.create({}, req.context)

    let queueType = await db.queueType.findOne({ code: req.body.code, organization: req.body.organization })

    if (queueType) {
        return 'queue-type code already exist'
    }
}

exports.canUpdate = async (req) => {
    if (!req.params.id) {
        return 'queue-type id is required'
    }
}

exports.canGet = async (req) => {
    if (!req.params.id) {
        return 'queue-type id required'
    }
}
