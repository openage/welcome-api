'use strict'

const summaryService = require('./../../../../services/summaries')
const appointmentService = require('./../../../../services/appointments')

exports.process = async (data, context) => {
    let log = context.logger.start('processors/cancelled/defaults:update-agent-summary')

    if (!data) { return }
    let appointment = await appointmentService.getById(data.id)

    let summary = await summaryService.getWithAgent({
        date: appointment.from,
        id: appointment.agent.id
    }, context)

    log.info(`Before appointment closed booked appointments count: ${summary.appointments.booked}`)

    return summaryService.updateOnAppointment(summary.id, -1, context).then((updatedSummary) => {
        log.info(`After appointment closed booked appointments count: ${updatedSummary.appointments.booked}`)
    })

}