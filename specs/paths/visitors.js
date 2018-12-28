module.exports = [
    {
        url: "/",
        "post": {
            "summary": "create visitors",
            "description": "create visitors",
            "parameters": [
                {
                    "name": "body",
                    "in": "body",
                    "required": true,
                    "schema": {
                        "$ref": "#/definitions/visitorsReq"
                    }
                }, {
                    "name": "x-role-key",
                    "in": "header",
                    "description": "role key",
                    "required": true,
                    "type": "string"
                }

            ],
            "responses": {
                "default": {
                    "description": "Unexpected error",
                    "schema": {
                        "$ref": "#/definitions/Error"
                    }
                }
            }

        },
        "get": {
            "summary": "Get visitors of your organization",
            "parameters": [
                "x-role-key",
                { name: 'pageNo', in: 'query', description: 'pageNo', required: false, type: 'number' },
                { name: 'serverPaging', in: 'query', description: 'serverPaging', required: false, type: 'boolean' },
                { name: 'pageSize', in: 'query', description: 'pageSize', required: false, type: 'number' },
                { name: 'name', in: 'query', description: 'search by name, phone', required: false, type: 'string' }
            ]
        }
    },
    {
        url: '/{id}',
        'put': {
            'summary': 'update visitors',
            'description': 'update visitors',
            'parameters': [
                {
                    'in': 'body',
                    'description': 'to update fields',
                    'required': true,
                    'schema': {
                        '$ref': '#/definitions/visitorsReq'
                    }
                },
                {
                    'name': 'id',
                    'in': 'path',
                    'description': 'visitors id',
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
        'get': {
            "parameters": [
                'x-role-key'
            ]
        }

    }]
