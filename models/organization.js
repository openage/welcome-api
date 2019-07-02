'use strict'

let mongoose = require('mongoose')
module.exports = {
    code: String,
    name: String,
    shortName: String,
    type: String,
    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },

    status: {
        type: String,
        default: 'active',
        enum: ['new', 'active', 'inactive']
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
    }
}
