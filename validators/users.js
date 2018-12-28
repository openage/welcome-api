'use strict'

exports.canCreate = async (req) => {
    if (!req.body.phone && !req.body.email) {
        return 'phone or email required'
    }
}
