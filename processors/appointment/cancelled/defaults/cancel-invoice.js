'use strict'

const db = require('./../../../../models')
let bapInvoiceProvider = require('../../../../providers/bap/invoice')

exports.process = async (data, context) => {
    let log = context.logger.start('processors/cancelled/defaults:cancel-invoice')

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

    return bapInvoiceProvider.update(appointment.invoice.id, {
        status: 'cancelled'
    }, appointment.agent.user.role.key, context)
}