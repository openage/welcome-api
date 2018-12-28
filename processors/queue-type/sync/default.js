'use strict'

const queueTypeService = require('../../../services/queue-types')
exports.process = async (data, context) => {
    let log = context.logger.start('processors:queue-type:sync')

    if (!data) { return }

    queueTypeService.sync(data.id, context).then(() => {
        log.info('queueType successfully updated')
    })

}