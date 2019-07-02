'use strict'
var mongoose = require('mongoose')
module.exports = {
    code: String, // employee code
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    data: Object,
    appointment: {
        duration: Number // in minutes
    },
    vacations: [{
        date: Date,
        reason: String
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    searchData: { type: Object }
}
