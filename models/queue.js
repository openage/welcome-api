'use strict'
var mongoose = require('mongoose')
module.exports = {
    date: Date,
    currentToken: Number,
    lastToken: Number,
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queueType'
    },
    status: {
        type: String,
        enum: [
            'active', 'closed'
        ]
    },
    agents: [{
        agent: { // doctor who are looking at the patients
            type: mongoose.Schema.Types.ObjectId,
            ref: 'agent'
        },
        status: {
            type: String,
            enum: [
                'active', 'in-active'
            ]
        }
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    }
}
