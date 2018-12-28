'use strict'
const summaryService = require('../services/summaries')
const mapper = require('../mappers/summary')

exports.search = (req, res) => {
    return summaryService.getDaySummary(req.query.fromDate, req.query.tillDate, req.query.agentId, req.context)
        .then(items => res.page(mapper.toSearchModel(items)))
        .catch(err => res.failure(err))
}
