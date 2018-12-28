'use strict'

exports.create = async (data, context) => {
    context.logger.start('services:queue-logs:create')

    return new db.queueLogs(data).save()
}

exports.getById = async (id, context) => {
    context.logger.start('services:queue-logs:getById')

    return db.queueLogs.findById({ _id: id })
}
