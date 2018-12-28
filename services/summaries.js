'use strict'

const logger = require('@open-age/logger')('services/summaries')
var moment = require('moment-timezone')
const availabilityService = require('./availabilities')
const db = require('../models')
const dateHelper = require('../helpers/dates')

const getWithAgent = async (data, context) => {
    let log = logger.start('fetching summary...')
    let date = data.date
    let fromDate = moment(date).startOf('day').toDate()
    let tillDate = moment(date).endOf('day').toDate()
    let query = {
        agent: data.id,
        date: {
            $gte: fromDate,
            $lte: tillDate
        }
    }
    log.end()

    return db.summary.findOne(query)
}

const updateOnAppointment = async (summaryId, number, context) => {
    context.logger.start('services/summaries:updateOnAppointment')

    return db.summary.update({ _id: summaryId }, { $inc: { 'appointments.booked': number } })
}

const create = async (model) => {
    return new db.summary(model).save()
}

const getEndTime = (availability, day) => {
    availability.schedule[day] = availability.schedule[day] || []
    let endTime

    availability.schedule[day].forEach(item => {
        if (dateHelper.time(item.endTime).gt(endTime) || !endTime) {
            endTime = item.endTime
        }
    })
    return endTime
}

const appointmentsStatus = (agentAvailability, date) => {
    let day = date.format('dddd').toLowerCase()
    if (!agentAvailability.schedule || !agentAvailability.schedule[day] || !agentAvailability.schedule[day].length) {
        return 'busy'
    }

    let endTime = getEndTime(agentAvailability, day)

    endTime = moment(date).set('hour', moment(endTime).hour())
        .set('minute', moment(endTime).minutes())
        .set('second', moment(endTime).seconds()).toDate()

    let lastAppointmentTime = moment(endTime).subtract(agentAvailability.appointment.duration, 'minutes')

    if (moment().isAfter(lastAppointmentTime, 'hh:mm:ss a')) {
        return 'busy'
    } else {
        return 'available'
    }
}

const getDaySummary = async (from, till, agentId, context) => {
    const log = context.logger.start('services/summaries:getDaySummary')

    let fromDate = from ? moment(from) : moment().startOf('month')
    let tillDate = till ? moment(till) : moment().endOf('month')

    let days = [] // array of moment

    for (let day = fromDate; day.isSameOrBefore(tillDate, 'day'); day = day.clone().add(1, 'day')) {
        days.push(day)
    }

    let availableDays = []
    let summaries = {}

    let availability = await availabilityService.getByAgent(agentId)

    if (!availability) {
        throw new Error('agent not found')
    }

    days.forEach(date => {
        summaries[date.format('YYYY-MM-DD')] = {
            date: date,
            agent: {
                id: agentId
            },
            appointments: {
                status: appointmentsStatus(availability, date) // TODO:'not-available'
            }
        }
    })

    let agentSummaries = await db.summary.find({
        date: {
            $gte: fromDate.toDate(),
            $lt: tillDate.toDate()
        },
        agent: agentId
    }).lean()

    agentSummaries.forEach((item) => {
        if (summaries[moment(item.date).format('YYYY-MM-DD')].appointments.status !== 'busy') {
            summaries[moment(item.date).format('YYYY-MM-DD')].appointments.status =
                item.appointments.booked >= item.appointments.total ? 'busy' : 'available'
        }
    })

    days.forEach((date) =>
        availableDays.push(summaries[date.format('YYYY-MM-DD').toString()]))

    log.end()
    return availableDays
}

exports.getDaySummary = getDaySummary
exports.getWithAgent = getWithAgent
exports.updateOnAppointment = updateOnAppointment
exports.create = create
