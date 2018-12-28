'use strict'
global.processSync = false
global.Promise = require('bluebird')
const express = require('express')
const logger = require('@open-age/logger')('bin/api').start('booting')
const webServerConfig = require('config').get('webServer')
const http = require('http')
var app = express()

require('moment-timezone').tz.setDefault("Asia/Calcutta|Asia/Kolkata")

require('./settings/database').configure(logger)

require('./helpers/string')
require('./helpers/toObjectId')

require('./settings/express').configure(app, logger)
require('./settings/routes').configure(app, logger)
require('./settings/offline-processor').configure(logger)


var port = process.env.PORT || webServerConfig.port
logger.info(`environment: ${process.env.NODE_ENV} port: ${port}`)

logger.info('starting server')
http.createServer(app).listen(port, function () {
    logger.info('listening on port:' + port)
    logger.end()
})

module.exports = app
