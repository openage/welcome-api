'use strict'

const hookService = require('../../../../services/hooks')

exports.process = async (data, context) => {
    context.logger.start('processors/availability:default')

    if (!data || !data.id) {
        throw new Error('id is required')
    }

    return hookService.availabilityCreateOrUpdate(data.id, context).then(() => {
        return
    })
}