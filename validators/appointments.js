'use strict'

let moment = require('moment-timezone')

exports.canCreate = async (req) => {
    if (!req.body.agent) {
        return 'agent is required'
    }

    if (!req.body.till || !req.body.from) {
        return 'till and from time both required'
    }

    if (moment(req.body.till).isBefore(moment())) {
        return 'appointment not available'
    }

    if (req.body.visitor && !(req.body.visitor.id || req.body.visitor.role)) {
        return 'visitor id or role required'
    }
}

exports.canUpdate = async (req) => {
    if (!req.params.id) {
        return 'appointment id required.'
    }

    if ((!req.body.till && req.body.from) || (req.body.till && !req.body.from)) {
        return 'till and from time both required.'
    }

    if (moment(req.body.till).isBefore(moment())) {
        return 'appointment not available'
    }
}

exports.canGet = async (req) => {
    if (!req.params.id) {
        return 'appointment id required.'
    }
}

exports.canCancelAgentAppointment = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.from || !req.body.till) {
        return 'from and till date required'
    }
}
