'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
const config = require('config').get('providers.bap')

exports.create = async (model, roleKey, context) => {
    let log = context.logger.start('creating invoice on billing and payments services ...')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey || context.role.key
        },
        data: model
    }

    // let url = `http://localhost:3030/api/invoices`

    let url = `${config.url}/api/invoices`

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

exports.update = async (id, model, roleKey, context) => {
    let log = context.logger.start('update invoice on billing and payments services ...')

    if (!id) {
        return null
    }

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey || context.role.key
        },
        data: model
    }

    // let url = `http://localhost:3030/api/invoices/${id}`

    let url = `${config.url}/api/invoices/${id}`

    log.info(`sending request to url: ${url}`)

    return new Promise((resolve, reject) => {
        return client.put(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                log.end()
                return reject(data.error)
            }
            log.end()
            return resolve(data.data)
        })
    })
}