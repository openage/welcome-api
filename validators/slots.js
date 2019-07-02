'use strict'

exports.canSearch = async (req) => {
    if (!req.query.agent && !req.query.availabilityId) {
        return 'agent or availabilityId required'
    }
}
