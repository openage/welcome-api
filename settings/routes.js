'use strict'
var auth = require('../helpers/auth')
var apiRoutes = require('@open-age/express-api')
var fs = require('fs')
var loggerConfig = require('config').get('logger')
var appRoot = require('app-root-path')

const specs = require('../specs')

module.exports.configure = (app, logger) => {
    logger.start('settings:routes:configure')

    let specsHandler = function (req, res) {
        fs.readFile('./public/specs.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('text/html')
            res.send(data)
        })
    }

    app.get('/', specsHandler)

    app.get('/logs', function (req, res) {
        var filePath = appRoot + '/' + loggerConfig.file.filename

        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('application/json')
            res.send(data)
        })
    })

    app.get('/swagger', (req, res) => {
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        })
        fs.readFile('./public/swagger.html', null, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.write(data)
            res.end()
        })
    })

    app.get('/specs', specsHandler)

    app.get('/api/specs', function (req, res) {
        res.contentType('application/json')
        res.send(specs.get())
    })

    // app.get('/api/versions/current', function (req, res) {
    //     var filePath = appRoot + '/version.json';

    //     fs.readFile(filePath, function (err, data) {
    //         res.contentType("application/json");
    //         res.send(data);
    //     });
    // });

    let api = apiRoutes(app)

    api.model('hooks')
        .register([{
            action: 'POST',
            method: 'userUpdate',
            url: '/user/update',
            filter: auth.requiresRoleKey
        }, {
            action: 'POST',
            method: 'organizationUpdate',
            url: '/organization/update',
            filter: auth.requiresRoleKey
        }])

    api.model('agents')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }])

    api.model('appointments')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'visitorAppointments',
            url: '/visitor',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'agentAppointments',
            url: '/agent/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'visitorAppointments',
            url: '/visitor/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'slot',
            url: '/:id/slot/:date',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'POST',
            method: 'cancelAgentAppointment',
            url: '/agent/:id/cancel',
            filter: auth.requiresRoleKey
        }, {
            action: 'POST',
            method: 'bulkUpdate',
            url: '/bulk/update',
            filter: auth.requiresRoleKey
        }])
    api.model({
        root: 'queueTypes',
        controller: 'queue-types'
    })
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey

        }])

    api.model('queues')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey

        }])

    api.model('visitors')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }])

    api.model('availabilities')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'getByAgent',
            url: '/agent/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }])
    api.model('sessions')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresTenantCode
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresTenantCode
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }])
    api.model('slots')
        .register([{
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }])

    api.model('summaries')
        .register([{
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }])
    logger.end()
}
