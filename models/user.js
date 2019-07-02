'use strict'
const mongoose = require('mongoose')
module.exports = {
    authId: String,
    role: {
        id: {
            type: String,
            unique: true,
            index: true,
            required: [true, 'role id required']
        },
        key: {
            type: String,
            unique: true,
            index: true
        },
        code: { type: String },
        permissions: [{ type: String }],
        user: {
            id: String
        },
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
    isPhoneValidate: { type: Boolean },
    isEmailValidate: { type: Boolean },
    isProfileComplete: { type: Boolean },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
    }
}
