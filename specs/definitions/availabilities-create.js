const schedule = require('./schedules')
const periodicity = require('./periodicities')

module.exports = {
    type: {
        name: 'string'
    },
    agent: {
        id: 'string'
    },
    appointment: {
        duration: 'number',
        fee: "string"
    },
    periodicity: periodicity,
    schedule: schedule
}