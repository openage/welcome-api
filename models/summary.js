'use strict'
var mongoose = require('mongoose')
module.exports = {
    date: Date,
    agent: { // Doctor, Principle
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent'
    },
    appointment: {
        booked: Number,
        total: Number
    }
}
