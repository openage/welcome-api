'use strict'

const offline = require('@open-age/offline-processor')
const queueLogService = require('../../../services/queue-logs')

exports.process = async (data, context) => {
    let log = context.logger.start('processor:create:default')

    let queueLog = await queueLogService.getById(data.id, context)

    if (!queueLog) { return }

    offline.queue(queueLog.entity, queueLog.action, { id: queueLog.id }, context)
}
