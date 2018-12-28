'use strict'

exports.canSearch = async (req) => {
    if (!req.query.agent) {
        return 'agent id required'
    }
}