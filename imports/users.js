'use strict'
var appRoot = require('app-root-path')
var users = require(`${appRoot}/services/users`)

var jsonfile = require('jsonfile')

exports.run = function (req) {
    if (!req.file) {
        throw new Error('json file is required')
    }

    var model = jsonfile.readFileSync(req.file)

    return users.create(model, req.context)
}
