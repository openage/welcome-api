const schedule = require('./schedules')
const periodicity = require('./periodicities')

module.exports = {
    appointment: {
        duration: 'number',
        fee: 'string'
    },
    periodicity: periodicity,
    schedule: schedule
}