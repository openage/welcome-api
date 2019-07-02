'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
const logger = require('@open-age/logger')('providers/directory')
const directoryConfig = require('config').get('providers.directory')

let parsedConfig = (config) => {
    config = config || {}

    return {
        url: config.url || directoryConfig.url,
        tenantKey: config.api_key || directoryConfig.api_key,
        lastSyncDate: config.lastSyncDate
    }
}

exports.getRole = (roleKey) => { // Get role from user dictatory
    let log = logger.start('getRole')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey
        }
    }

    let url = `${directoryConfig.url}/api/roles/my`
    log.info(`sending request to url: ${url}`)

    return new Promise((resolve, reject) => {
        return client.getPromise(url, args).then((response) => {
            log.end()
            if (!response || !response.data.isSuccess) {
                return reject(new Error(response.data.error || response.data.message))
            }
            return resolve(response.data.data)
        })
    })
}

exports.getRoleById = (id, token) => {
    let log = logger.start('getRoleById')

    let config = parsedConfig()

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': token
        }
    }

    let url = `${directoryConfig.url}/api/roles/${id}`

    log.debug(`fetching data from url: ${url}`)

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            log.end()
            if (!data || !data.isSuccess) {
                return reject(new Error(response.data.error || response.data.message))
            }
            return resolve(data.data)
        })
    })
}

