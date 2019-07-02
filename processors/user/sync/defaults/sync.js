'use strict'

const queueLogService = require('./../../../../services/queue-logs')
const userService = require('./../../../../services/users')

exports.process = async (data, context) => {
    let log = context.logger.start('processor:user:sync:defaults')

    const queueLog = await queueLogService.getById(data.id, context)

    if (!queueLog) { return }

    queueLog.context.logger = context.logger

    return userService.sync(queueLog.data, queueLog.context).then(() => {
        log.info('user updated')
    }).catch((err) => {
        log.error(err)
        return err
    })
}
