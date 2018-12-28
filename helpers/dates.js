'use strict'
var moment = require('moment-timezone')

exports.day = (date) => {
    let day = date ? moment(date).weekday() : moment().weekday()

    switch (day) {
        case 0:
            return 'sunday'
        case 1:
            return 'monday'
        case 2:
            return 'tuesday'
        case 3:
            return 'wednesday'
        case 4:
            return 'thursday'
        case 5:
            return 'friday'
        case 6:
            return 'saturday'
    }
}

exports.diff = (date1, date2) => {
    return moment(date1).diff(moment(date2), 'seconds')
}

exports.days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

exports.time = (time1) => {
    return {
        lt: (time2) => {
            if (!time2 || (!time1 && !time2)) {
                return false
            }

            if (!time1) {
                return true
            }

            let date = new Date()

            let timeA = moment(date)
                .set('hour', moment(time1).hour())
                .set('minute', moment(time1).minutes())
                .set('second', moment(time1).seconds())

            let timeB = moment(date)
                .set('hour', moment(time2).hour())
                .set('minute', moment(time2).minutes())
                .set('second', moment(time2).seconds())

            return (timeA.isBefore(timeB, 's'))
        },
        gt: (time2) => {
            if (!time2 || (!time1 && !time2)) {
                return false
            }

            if (!time1) {
                return true
            }

            let date = new Date()

            let timeA = moment(date)
                .set('hour', moment(time1).hour())
                .set('minute', moment(time1).minutes())
                .set('second', moment(time1).seconds())

            let timeB = moment(date)
                .set('hour', moment(time2).hour())
                .set('minute', moment(time2).minutes())
                .set('second', moment(time2).seconds())

            return (timeA.isAfter(timeB, 's'))
        }
    }
}
