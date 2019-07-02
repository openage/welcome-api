'use strict'

exports.toModel = entity => {
    var model = {
        date: entity.date,
        isDaySummary: entity.isDaySummary,
        isMonthSummary: entity.isMonthSummary,
        isYearSummary: entity.isYearSummary
    }

    if (entity.appointment) {
        model.appointments = {
            total: entity.appointment.total,
            booked: entity.appointment.booked,
            status: entity.appointment.status
        }
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity)
    })
}
