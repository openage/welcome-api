'use strict'

const db = require('./../../../../models')
const sendIt = require('../../../../providers/sendIt')
let moment = require('moment-timezone')


exports.process = async (data, context) => {
    let log = context.logger.start('processors/failed/defaults:notify-visitor')

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
        }
    }, 'notify-visitor-on-appointment-failed',
        [{ roleKey: appointment.visitor.user.role.key }],
        appointment.agent.user.role.key, ['push']).then((response) => {
            context.logger.info('push delivered')
        })

}