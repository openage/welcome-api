'use strict'
const mongoose = require('mongoose')
module.exports = {
    authId: String,
    role: {
        id: {
            type: String,
            // unique: true
        },
        key: { type: String },
        code: { type: String },
        permissions: [{ type: String }],
        organization: {
            id: String,
            code: String
        }
    },
    picUrl: String,  // TODO: obsolete
    pic: {
        url: String,
        thumbnail: String
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dob: Date,
    gender: {
        type: String,
        enum: [
            'male', 'female', 'other'
        ]
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        //  required: true
    }
}
