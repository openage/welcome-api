'use strict'
const agentService = require('../services/agents')

exports.canCreate = async (req) => {
    if (!req.context.organization) {
        return 'invalid role-key'
    }

    if (!req.body.type) {
        return 'type is required.'
    }

    if (!req.body.agent) {
        let agent = await agentService.create({ user: req.context.user.id, organization: req.context.organization }, req.context)
        req.context.agent = agent
    }
}

exports.canUpdate = async (req) => {
    if (!req.params.id) {
        return 'id is required.'
    }
}

exports.canGetByAgent = async (req) => {
    if (req.params.id === 'my' && !req.context.organization) {
        return 'invalid role-key'
    }
}
