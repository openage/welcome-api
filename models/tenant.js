'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: String,
    config: Object,
    logo: {
        url: String,
        thumbnail: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    hooks: { // after action happens
        availability: {
            onCreate: {
                url: String, // https://domain.com/hooks/store
                action: String, // POST
                headers: {}
            },
            onUpdate: {
                url: String,
                action: String,
                headers: {}
            },
            onDelete: {
                url: String,
                action: String,
                headers: {}
            }
        }
    }

}
