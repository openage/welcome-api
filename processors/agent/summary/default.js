'use strict'

let logger = require('@open-age/logger')('processors.summary.create.default')
var moment = require('moment-timezone')
let async = require('async')
const summaries = require('../../../services/summaries')
const availabilities = require('../../../services/availabilities')

var getMinutes = function (startTime, endTime) {
    logger.start('getMinutes')
    var mins = moment(startTime, 'HH:mm:ss').diff(moment(endTime, 'HH:mm:ss')) / 60000
    return Math.abs(mins)
}

var createSummary = async (data, context) => {
    let log = logger.start('createSummary')

    let availability = await availabilities.getByAgent(data.id)

    let day = moment(data.date).format('dddd').toLowerCase()
    let daySchedule = availability.schedule[day]
    let totalMinutes = 0
    daySchedule.forEach((item) => {
        totalMinutes = getMinutes(item.startTime, item.endTime)
    })
    log.info('Total Minutes', `${totalMinutes}`)

    let totalAppointmentForBooking = Math.abs(totalMinutes / availability.appointment.duration)
    let summaryModel = {
        agent: data.id,
        date: data.date,
        appointment: {
            total: Math.trunc(totalAppointmentForBooking),
            booked: 0
        }
    }

    return summaries.create(summaryModel)
}

exports.process = function (data, context, callback) {
    let log = logger.start('process')

    if (!data.isProcessing) {
        return callback()
    }

    async.waterfall([
        function (cb) {
            summaries.getWithAgent(data, context).then((summary) => {
                if (summary) {
                    return cb(null, summary)
                }
                return createSummary(data).then(item => cb(null, item))
            }).catch(err => cb(err))
        },
        function (summary, cb) {
            summaries.updateOnAppointment(summary.id, 1, context).then(() => cb(null)).catch(err => cb(err))
        }
    ],
        function (err) {
            if (err) {
                log.error(err)
                return callback(err)
            }
            return callback()
        })
}
