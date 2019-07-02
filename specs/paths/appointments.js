module.exports = [{
    url: '/',
    get: {
        'description': 'search appointment',
        'parameters': [
            'x-role-key',
            { name: 'agentId', in: 'query', description: 'agent id', required: false, type: 'string' },
            { name: 'visitorId', in: 'query', description: 'visitor id', required: false, type: 'string' },
            { name: 'from', in: 'query', description: 'date', required: false, type: 'string' }
        ]
    },
    post: {
        description: 'create appointment with roleKey',
        parameters: ['x-role-key']
    }
}, {
    url: '/{id}',
    get: {
        'description': 'get appointment with roleKey',
        'parameters': [
            'x-role-key',
            { name: 'id', in: 'path', description: 'appointment id', required: true, type: 'string' }
        ]
    },
    put: {
        'description': 'update appointment with roleKey',
        'parameters': [
            'x-role-key',
            { name: 'id', in: 'path', description: 'appointment id', required: true, type: 'string' }
        ]
    }
}, {
    url: '/agent/{id}',
    get: {
        'description': 'search appointment',
        'parameters': [
            'x-role-key',
            { name: 'id', in: 'path', description: 'agent id or my', required: true, type: 'string' },
            { name: 'from', in: 'query', description: 'date', required: false, type: 'string' }
        ]
    }
}, {
    url: '/visitor/{id}',
    get: {
        description: 'visitor appointments',
        parameters: [
            'x-role-key',
            { name: 'id', in: 'path', description: 'visitor id or my', required: true, type: 'string' }
        ],
        responses: {
            default: {
                schema: {
                    '$ref': '#/definitions/appointmentVisitorRes'
                }
            }
        }
    }
}, {
    url: '/agent/{id}/cancel',
    post: {
        description: 'cancel all appointments of agent',
        parameters: [
            'x-role-key',
            { name: 'id', in: 'path', description: 'agent id or my', required: true, type: 'string' },
            {
                name: 'body',
                in: 'body',
                description: 'cancel agent appointment from to till',
                required: true,
                schema: {
                    $ref: '#/definitions/appointmentsCancelReq'
                }
            }
        ]
    }

}, {
    url: '/bulk/update',
    post: {
        description: 'update appointments in bulk',
        parameters: [
            'x-role-key',
            {
                name: 'body',
                in: 'body',
                description: 'appointments list',
                required: true,
                schema: {
                    $ref: '#/definitions/appointmentsBulkUpdateReq'
                }
            }
        ]
    }

}]
