'use strict'
var mongoose = require('mongoose')
module.exports = {
    purpose: String, // Root Canal Treatment
    from: Date,
    till: Date,
    startTime: Date, // the actual time when the appointment started
    endTime: Date, // the actual time when the appointment ended
    data: {},
    agent: { // Doctor, Principle
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent'
    },
    visitor: { // Patient, Student, Candidate
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitor'
    },
    token: {
        no: String,
        queue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'queue'
        }
    },
    camp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'camp'
    },
    status: {
        type: String,
        enum: ['scheduled', 'rescheduled', 'visited', 'closed', 'cancelled', 'failed', 'draft']  // failed when visitor not present
    },                                                                     // closed when hospital or doctor cancelled
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
        required: true
    },
    queueType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'queueType'
    },
    invoice: {
        id: String
    }
}
