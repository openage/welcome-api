module.exports = [{
    name: 'sessionReq',
    properties: {
        'user': {
            'type': 'object',
            'properties': {
                'type': {
                    'type': 'object'
                },
                'ref': {
                    'type': 'string'
                }
            }
        },
        'userToken': {
            'type': 'string'
        },
        'roles': {
            'type': 'object',
            'properties': {
                'type': {
                    'type': 'object'
                }
            }
        },
        'status': {
            'type': 'object',
            'properties': {
                'type': {
                    'type': 'string'
                },
                'enum': {
                    'type': 'object'
                }
            }
        }
    }
}]
