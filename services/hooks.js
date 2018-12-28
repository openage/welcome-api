'use strict'
const client = new (require('node-rest-client-promise')).Client()
const tenantService = require('./tenants')

const getHeader = (config, data) => {   //todo 
    let headers = {}
    Object.keys(config.headers).forEach(key => {
        headers[key] = config.headers[key].inject(data)
    })

    return headers
}

exports.availabilityCreateOrUpdate = async (availabilityId, context) => {
    let log = context.logger.start('services/hooks:availabilityCreate')

    let availability = await db.availability.findById(availabilityId).populate({
        path: 'agent',
        populate: {
            path: 'organization user'
        }
    })

    let promises = []

    let tenant = await tenantService.get({ code: 'axon' }, context)    //todo for tenant

    if (!availability) {
        return
    }

    let model = {
        appointmentFee: availability.appointmentFee,
        schedule: availability.schedule,
        agent: {
            id: availability.agent.id
        },
        role: {
            id: availability.agent.user.role.id
        }
    }

    Object.keys(tenant.hooks).forEach(key => {
        if ((key !== 'availability') || !tenant.hooks[key].onCreate) {
            return
        }

        let hooksConfig = tenant.hooks[key].onCreate
        log.info(`send request to url: ${hooksConfig.url}`)

        promises.push(client.postPromise(hooksConfig.url, {
            headers: {
                "Content-Type": "application/json",
                "x-role-key": availability.agent.user.role.key
            },
            data: model
        })
            .then((response) => {
                log.info('updated :' + response.data.message)
                return Promise.resolve()
            })
            .catch(err => {
                log.error('err :' + err)
                return Promise.reject(err)
            }))
    })

    return Promise.all(promises)
}