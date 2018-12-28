'use strict'

exports.canGet = async (req) => {
    if (!req.params.id) {
        return 'id required'
    }

    if (req.params.id === 'my' && !req.context.organization) {
        return 'invalid role-key'
    }
}
