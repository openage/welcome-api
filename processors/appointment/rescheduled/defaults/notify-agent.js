'use strict'

const db = require('./../../../../models')
const sendIt = require('../../../../providers/sendIt')
let moment = require('moment-timezone')


exports.process = async (data, context) => {
    let log = context.logger.start('processors/rescheduled/defaults:notify-agent')

    if (!data) { return }

    let appointment = await db.appointment.findById(data.id).populate({
        path: 'agent',
        populate: {
            path: 'user'
        }
    }).populate({
        path: 'visitor',
        populate: {
            path: 'user'
        }
    })

    return sendIt.send({
        entity: {
            id: appointment.id,
            type: 'appointment'
        },
        startTime: moment(appointment.from).format('LT'),
        startDate: moment(appointment.from).format('LL'),
        visitorName: `${appointment.visitor.user.firstName} ${appointment.visitor.user.lastName}`
    }, 'notify-agent-on-appointment-rescheduled',
        [{ roleKey: appointment.agent.user.role.key }],
        appointment.visitor.user.role.key, ['push']).then((response) => {
            context.logger.info('push delivered')
        })
}