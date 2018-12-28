'use strict'

const queueLogServices = require('../../../../services/queue-logs')
const organizationService = require('../../../../services/organizations')

exports.process = async (data, context) => {
    let log = context.logger.start('processors:organization:sync')

    const queueLog = await queueLogServices.getById(data.id, context)

    if (!queueLog) { return }

    queueLog.context.logger = context.logger

    return organizationService.update(queueLog.data, queueLog.data._id.toString(), queueLog.context).then(() => {
        log.info('organization updated')
    }).catch((err) => {
        log.error(err)
        return err
    })
}
