module.exports = [{
    url: '/',
    post: {
        'description': 'create agent with roleKey',
        'parameters': [{
            'name': 'body',
            'in': 'body',
            'description': 'agent',
            'required': true,
            'schema': {
                '$ref': '#/definitions/agentReq'
            }
        }, {
            'name': 'x-role-key',
            'in': 'header',
            'description': 'role key of agent',
            'required': true,
            'type': 'string'
        }],

        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/agentRes'
                }
            }
        }
    },
    get: {
        description: 'search agents with filter',
        parameters: [
            'x-role-key',
            { name: 'pageNo', in: 'query', description: 'pageNo', required: false, type: 'number' },
            { name: 'serverPaging', in: 'query', description: 'serverPaging', required: false, type: 'boolean' },
            { name: 'pageSize', in: 'query', description: 'pageSize', required: false, type: 'number' },
            { name: 'name', in: 'query', description: 'search by name, phone', required: false, type: 'string' }
        ],
        responses: {
            default: {
                description: 'Unexpected error',
                schema: {
                    $ref: '#/definitions/agentRes'
                }
            }
        }
    }

}, {
    url: '/{id}',
    get: {
        'description': 'search agents with filter',
        parameters: [{
            'name': 'id',
            'in': 'path',
            'description': "agent id or 'my'",
            'required': true
        }, {
            'name': 'x-role-key',
            'in': 'header',
            'description': 'role key of agent',
            'required': true,
            'type': 'string'
        }],
        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/agentRes'
                }
            }
        }
    },
    put: {
        'description': 'update agent with roleKey',
        parameters: [{
            'name': 'id',
            'in': 'path',
            'description': "agent id or 'my'",
            'required': true
        }, {
            'name': 'body',
            'in': 'body',
            'description': 'agent',
            'required': true,
            'schema': {
                '$ref': '#/definitions/agentReq'
            }
        }, {
            'name': 'x-role-key',
            'in': 'header',
            'description': 'role key of agent',
            'required': true,
            'type': 'string'
        }],
        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/agentRes'
                }
            }
        }
    }
}]
