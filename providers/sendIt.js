'use strict'

const logger = require('@open-age/logger')('providers/sendIt')
let sendItConfig = require('config').get('providers.sendIt')
var Client = require('node-rest-client-promise').Client
const client = new Client()

exports.send = (data, templateCode, to, from, modes) => {
    var log = logger.start('sending message')

    let url = `${sendItConfig.url}/api/messages`

    var args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': from // role key here
        },
        data: {
            'template': {
                'code': templateCode
            },
            'to': to, // Array of objects
            'data': data,
            'modes': modes // list of modes
        }
    }

    return new Promise((resolve, reject) => {
        return client.postPromise(url, args)
            .then((response) => {
                log.end()
                if (!response.data.isSuccess) {
                    return reject(new Error(`invalid response from sendIt`))
                }
                return resolve(response.data)
            })
    })
}
