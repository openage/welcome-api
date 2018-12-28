'use strict'

const async = require('async')
const logger = require('@open-age/logger')('appointment.create.default')
const appointmentService = require('./../../../../services/appointments')
const agentService = require('./../../../../services/agents')
const visitorService = require('./../../../../services/visitors')
const sendIt = require('./../../../../providers/sendIt')
var moment = require('moment-timezone')

exports.process = (data, context, callback) => {
    let log = logger.start('process')

    if (!data.isProcessing) {
        return callback()
    }

    // async.waterfall([], () => {});

    async.waterfall([
        (cb) => {
            appointmentService.getById(data.id, context)
                .then((appointment) => {
                    return cb(null, appointment)
                })
        },
        (appointment, cb) => {
            agentService.getByIdOrContext(appointment.agent.id, context)
                .then((agent) => {
                    return cb(null, appointment, agent)
                })
        },
        (appointment, agent, cb) => {
            visitorService.getByIdOrContext(appointment.visitor.id, context)
                .then((visitor) => {
                    return cb(null, appointment, agent, visitor)
                })
        },
        (appointment, agent, visitor, cb) => {
            return sendIt.send({
                entity: {
                    id: appointment.id,
                    type: 'appointment'
                },
                visitorName: `${visitor.user.firstName} ${visitor.user.lastName}`,
                appointmentDate: moment(appointment.from).format('LL'),
                appointmentTime: moment(appointment.from).format('LT')
            }, 'notify-agent-on-appointment-booked', [{ roleKey: agent.user.role.key }], visitor.user.role.key, ['push'])
                .then((response) => {
                    log.debug(response.data)
                    log.info('message pushed')
                    return cb(null)
                })
                .catch((err) => {
                    log.error(err)
                    return cb(err)
                })
        }
    ], (err) => {
        if (err) {
            return callback(err)
        }
        return callback()
    })
}
