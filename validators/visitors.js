'use strict'

exports.canGet = async (req) => {
    if (!req.params.id) {
        return 'id required'
    }
}