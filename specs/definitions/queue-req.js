module.exports = [{
    name: 'queueReq',
    properties: {
        'date': {
            'type': 'string'
        },
        'currentToken': {
            'type': 'number'
        },
        'lastToken': {
            'type': 'number'
        },
        'type': {
            'type': 'string'
        },
        'status': {
            'type': 'object',
            'properties': {
                'type': {
                    'type': 'string'
                }

            }
        },
        'agents': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'agent': {
                        'type': 'string'
                    },
                    'status': {
                        'type': 'string'
                    }
                }
            }

        },

        'organization': {
            'type': 'string'
        }
    }
}]
