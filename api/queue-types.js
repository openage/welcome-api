'use strict'

const logger = require('@open-age/logger')('queue-types')
const queueTypes = require('../services/queue-types')
const organizationService = require('../services/organizations')
const mapper = require('../mappers/queue-type')
const db = require('../models')

exports.create = async (req, res) => {
    let log = logger.start('creating queue-type...')

    let model = {
        name: req.body.name,
        purpose: req.body.purpose,
        maxQueueSize: req.body.maxQueueSize,
        availability: req.body.availability,
        status: req.body.status || 'active',
        agents: req.body.agents
    }

    if (!req.body.organization.id && req.body.organization.code) {
        model.organization = db.organization.findOne({ code: req.body.organization.code })
    } else {
        model.organization = req.body.organization.id
    }

    try {
        let queueType = await queueTypes.create(model, req.context)
        return res.data(mapper.toModel(queueType))
    } catch (err) {
        log.error(err)
        return res.failure
    }
}

exports.update = async (req, res) => {
    let log = logger.start('update queue-type...')

    let model = req.body

    try {
        let queueType = await queueTypes.getById(req.params.id, req.context)

        if (model.code) {
            let sameQueueType = await db.queueType.findOne({ code: model.code }, { organization: queueType.organization })

            if (sameQueueType) { throw new Error('queue-type already exist') }
        }

        let updatedQueueType = await queueTypes.update(queueType, model, req.context)

        return res.data(mapper.toModel(updatedQueueType))
    } catch (error) {
        log.error(error)
        res.failure(error)
    }
}

exports.get = async (req, res) => {
    let log = logger.start('get')

    try {
        let queueType = await queueTypes.getById(req.params.id, req.context)

        return res.data(mapper.toModel(queueType))
    } catch (error) {
        log.error(error)
        res.failure(error)
    }
}

exports.search = async (req, res) => {
    let log = logger.start('api/queue-types:search')
    let query = {}

    if (req.query.organizationId) {
        query.organization = req.query.organizationId.isObjectId()
            ? await db.organization.findById(req.query.organizationId)
            : await db.organization.findOne({ code: req.query.organizationId })
    }

    if (req.query.code) {
        query.name = req.query.code
    }

    db.queueType.find(query)
        .then((queueTypes) => {
            log.debug(`${queueTypes}`)
            log.end()
            return res.page(mapper.toSearchModel(queueTypes))
        }).catch((err) => {
            log.end()
            res.failure(err)
        })
}
