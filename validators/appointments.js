'use strict'

let moment = require('moment-timezone')
const appointments = require('../services/appointments')
const agents = require('../services/agents')
const db = require('../models')

exports.canCreate = async (req) => {
    if (!req.body.agent) {
        return 'agent is required'
    }

    if (!req.body.till || !req.body.from) {
        return 'till and from time both required'
    }

    if (moment(req.body.from).isBefore(moment())) {
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

    if (req.body.form && moment(req.body.from).isBefore(moment())) {
        return 'appointment not available'
    }


}

exports.get = async (req) => {
    if (!req.params.id) {
        return 'appointment id required.'
    }
}
