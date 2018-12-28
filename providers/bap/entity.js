'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
const config = require('config').get('providers.bap')

exports.create = async (model, roleKey, context) => {
    let log = context.logger.start('creating entity on billing and payments services ...')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey || context.role.key
        },
        data: model
    }

    // let url = `http://localhost:3030/api/entities`

    let url = `${config.url}/api/entities`

    log.info(`sending request to url: ${url}`)

    return new Promise((resolve, reject) => {
        return client.post(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                log.end()
                return reject(data.error)
            }
            log.end()
            return resolve(data.data)
        })
    })
}