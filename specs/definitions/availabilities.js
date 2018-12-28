const schedule = require('./schedules')
const periodicity = require('./periodicities')
const queueType = require('./queue-type')

module.exports = {
    id: 'string',
    periodicity: periodicity,
    schedule: schedule,
    appointment: {
        duration: 'number',
        fee: 'string'
    }
    // queueType: queueType
}