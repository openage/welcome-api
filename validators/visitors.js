'use strict'

exports.canCreate = async (req) => {
    if (!req.body.role) {
        return 'role required'
    }

    if (!req.body.organization && !req.context.organization) {
        return 'organization required'
    }
}

exports.canGet = async (req) => {
    if (!req.params.id) {
        return 'id required'
    }
}