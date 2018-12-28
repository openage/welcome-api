module.exports = [{
    url: '/',
    post: {
        'description': 'create queue-type for organization',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': true,
                'description': 'Queue-type details',
                'schema': {
                    '$ref': '#/definitions/queueTypeReq'
                }

            },
            {
                'name': 'x-role-key',
                'in': 'header',
                'description': 'role key',
                'required': true,
                'type': 'string'
            }
        ],
        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/Error'
                }
            }
        }
    },

    get: {
        'parameters': [{
            'name': 'organizationId',
            'in': 'query',
            'description': 'organization id or code',
            'required': false,
            'type': 'string'
        }, {
            'name': 'code',
            'in': 'query',
            'description': 'code of queue-type',
            'required': false,
            'type': 'string'
        }, {
            'name': 'x-role-key',
            'in': 'header',
            'description': 'role key',
            'required': true,
            'type': 'string'
        }],

        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/Error'
                }
            }
        }

    }

}, {
    url: '/{id}',
    put: {
        'description': 'update queue-type of organization',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': true,
                'description': 'Queue-type details',
                'schema': {
                    '$ref': '#/definitions/queueTypeReq'
                }

            }, {
                'name': 'id',
                'in': 'path',
                'description': 'queue-type id',
                'required': true,
                'type': 'string'
            }, {
                'name': 'x-role-key',
                'in': 'header',
                'description': 'role key',
                'required': true,
                'type': 'string'
            }
        ],
        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/Error'
                }
            }
        }
    },
    get: {
        'description': 'get queue-type of  organization',
        'parameters': [
            {
                'name': 'id',
                'in': 'path',
                'description': 'queue-type id',
                'required': true,
                'type': 'string'
            }, {
                'name': 'x-role-key',
                'in': 'header',
                'description': 'role key',
                'required': true,
                'type': 'string'
            }
        ],
        'responses': {
            'default': {
                'description': 'Unexpected error',
                'schema': {
                    '$ref': '#/definitions/Error'
                }
            }
        }
    }
}]
