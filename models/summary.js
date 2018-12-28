'use strict'
var mongoose = require('mongoose')
module.exports = {
    date: Date,
    agent: { // Doctor, Principle
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agent'
    },
    appointments: {
        booked: Number,
        total: Number
    }
}
