'use strict'
var mongoose = require('mongoose')
module.exports = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    data: Object, // todo remove
    type: {
        type: String
    },
    identities: [{
        no: String,
        image: { // scanned image of the id proof
            url: String,
            data: String
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'identityType'
        }
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    searchData: { type: Object }
}
