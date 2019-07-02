const appointment = require('./appointments')

module.exports = {
    upcoming: [appointment],
    old: [appointment],
    cancelled: [appointment]
}
