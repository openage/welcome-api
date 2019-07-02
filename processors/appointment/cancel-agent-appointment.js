'use strict'

const appointmentService = require('../../services/appointments')

exports.process = (data, context) => {
    if (!data) {
        return
    }

    let log = context.logger.start(`cancel agent appointments start ... `)

    return appointmentService.cancelAgentAppointments(data, context).then(retVal => {
        log.info(retVal)
        log.end()
        return retVal
    }).catch(err => {
        log.error(err)
        return err
    })
}
