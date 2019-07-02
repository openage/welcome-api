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

    return db.summary.update({ _id: summaryId }, { $inc: { 'appointment.booked': number } })
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

const setAppointmentStatus = (agentAvailability, date) => {
    let day = date.format('dddd').toLowerCase()
    if (!agentAvailability.schedule || !agentAvailability.schedule[day] || !agentAvailability.schedule[day].length) {
        return 'busy'
    }

    let endTime = getEndTime(agentAvailability, day)
    endTime = dateHelper.date(date).setTime(endTime)

    let duration = agentAvailability.appointment.duration
    let lastAppointmentTime = moment(endTime).subtract(duration, 'minutes')

    if (moment().isAfter(lastAppointmentTime, 'hh:mm:ss a')) {
        return 'busy'
    } else {
        return 'available'
    }
}

const getDayWiseSummary = async (from, till, agentId, context) => {
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
            isDaySummary: true,
            appointment: {
                status: setAppointmentStatus(availability, date) // TODO:'not-available'
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
        if (summaries[moment(item.date).format('YYYY-MM-DD')].appointment.status !== 'busy') {
            summaries[moment(item.date).format('YYYY-MM-DD')].appointment.status =
                item.appointment.booked >= item.appointment.total ? 'busy' : 'available'
        }
    })

    days.forEach((date) =>
        availableDays.push(summaries[date.format('YYYY-MM-DD').toString()]))

    log.end()
    return availableDays
}

const getMonthWiseSummary = async (fromDate, tillDate, agentId, context) => {
    let log = context.logger.start('services/summaries:getMonthWiseSummary')

    let months = []
    let summaries = []

    for (let date = moment(fromDate); date.isSameOrBefore(tillDate, 'month'); date = date.clone().add(1, 'month')) {
        months.push(date)
    }
    if (!months.length) { months.push(fromDate) }

    for (let index = 0; index < months.length; index++) {
        let monthDate = months[index]
        let startOfMonth = moment(monthDate).startOf('month').toDate()
        let endOfMonth = moment(monthDate).endOf('month').toDate()

        let summary = await groupSummary(startOfMonth, endOfMonth, agentId, context)
        if (summary.length) {
            summary = summary[0]
            summary.isMonthSummary = true
            summaries[index] = summary
        }
    }

    log.end()
    return summaries
}

const getYearWiseSummary = async (fromDate, tillDate, agentId, context) => {
    let log = context.logger.start('services:summaries:getYearWiseSummary')

    let years = []
    let summaries = []

    for (let date = moment(fromDate); date.isSameOrBefore(tillDate, 'year'); date = date.clone().add(1, 'year')) {
        years.push(date)
    }
    if (!years.length) { years.push(fromDate) }

    for (let index = 0; index < years.length; index++) {
        let yearDate = years[index]
        let startOfYear = moment(yearDate).startOf('year').toDate()
        let endOfYear = moment(yearDate).endOf('year').toDate()

        let summary = await groupSummary(startOfYear, endOfYear, agentId, context)
        if (summary.length) {
            summary = summary[0]
            summary.isYearSummary = true
            summaries[index] = summary
        }
    }

    log.end()
    return summaries
}

const groupSummary = async (startDate, endDate, agentId, context) => {
    context.logger.start('getting group summary start ...')

    return db.summary.aggregate([{
        $match: {
            date: {
                $gte: startDate,
                $lt: endDate
            },
            agent: agentId.toObjectId()
        }
    }, {
        $group: {
            _id: null,
            'totalBookedAppointments': { $sum: '$appointment.booked' },
            'totalAppointments': { $sum: '$appointment.total' }
        }
    }, {
        $project: {
            date: startDate,
            agent: agentId.toObjectId(),
            'appointment.booked': '$totalBookedAppointments',
            'appointment.total': '$totalAppointments'
        }
    }
    ])
}

exports.create = create
exports.getWithAgent = getWithAgent
exports.updateOnAppointment = updateOnAppointment

exports.getDayWiseSummary = getDayWiseSummary
exports.getMonthWiseSummary = getMonthWiseSummary
exports.getYearWiseSummary = getYearWiseSummary
