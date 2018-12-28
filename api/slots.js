'use strict'
const logger = require('@open-age/logger')('slots')
let moment = require('moment-timezone')
let mapper = require('../mappers/slot')
let appointmentMapper = require('../mappers/appointment')
const availabilities = require('../services/availabilities')
const appointments = require('../services/appointments')

const generateTimeSlots = async (timeTable, gap) => { // timeTable is array of object having startTime and endTime
    let log = logger.start('generateTimeSlots') // gap is intervalTime gap

    let timeSlots = []

    timeTable.forEach(period => {
        let mins = moment(period.startTime, 'HH:mm:ss').diff(moment(period.endTime, 'HH:mm:ss')) / 60000

        let totalSlots = Math.abs(Math.trunc(mins / gap))
        let slot = 0

        let current = moment(period.startTime)

        while (slot < totalSlots) {
            let interval = {
                start: current.toISOString(),
                end: current.add(gap, 'minutes').subtract(1, 'second').toISOString(),
                status: 'available'
            }
            timeSlots.push(interval)
            current.add(1, 'second')
            slot++
        }
    })

    log.end()
    return timeSlots
}

const updatingTimeSlotsByDate = (timeSlots, byDate) => {
    let log = logger.start('updatingStartTime')

    timeSlots.forEach((period) => {
        period.startTime = moment(byDate).set('hour', moment(period.startTime).hour())
            .set('minute', moment(period.startTime).minutes())
            .set('second', moment(period.startTime).seconds()).toDate()

        period.endTime = moment(byDate).set('hour', moment(period.endTime).hour())
            .set('minute', moment(period.endTime).minutes())
            .set('second', moment(period.endTime).seconds()).toDate()
    })

    log.end()
    return timeSlots
}

exports.search = async (req, res) => {
    let log = logger.start('api/slots:search')

    try {
        let availability = await availabilities.getByAgent(req.query.agent)

        if (!availability) {
            throw new Error('agent not found')
        }

        let from = req.query.date || moment()

        let day = moment(from).format('dddd').toLowerCase()

        let timeTable = availability.schedule[day]

        timeTable = updatingTimeSlotsByDate(timeTable, moment(from).toDate())

        let timeSlots = await generateTimeSlots(timeTable, availability.appointment.duration)

        let fromDate = moment(from).startOf('day').toDate()
        let tillDate = moment(from).endOf('day').toDate()
        let query = {
            agent: req.query.agent,
            from: {
                $gte: fromDate,
                $lt: tillDate
            }
        }

        let agentAppointments = await appointments.agentAppointments(query, req.context)

        if (agentAppointments.length) {
            agentAppointments.forEach((appointment) => {
                timeSlots.forEach((slot) => {
                    if (slot.status !== 'booked') {
                        if (moment(slot.start).isSameOrBefore(moment())) {
                            slot.status = 'booked'
                        }
                        if ((moment(appointment.from).isSame(slot.start, 'hh:mm:ss a') ||
                            moment(appointment.from).isBetween(slot.start, slot.end, 'hh:mm:ss a'))) {
                            if (((appointment.status !== 'cancelled') && (appointment.status !== 'closed'))) {
                                slot.id = appointment.id
                                slot.visitor = appointment.visitor
                                slot.status = 'booked'
                                slot.agent = appointment.agent
                                slot.organization = appointment.organization
                            }
                        }
                    }
                })
            })
        } else {
            timeSlots.forEach((slot) => {
                if (moment(slot.start).isSameOrBefore(moment())) {
                    slot.status = 'booked'
                }
            })
        }

        return {
            items: appointmentMapper.toSearchModel(timeSlots),
            total: timeSlots.length
        }
    } catch (error) {
        log.error(error)
        res.failure(error)
    }
}
