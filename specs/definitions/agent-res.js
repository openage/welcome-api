module.exports = [{
    name: 'agentRes',
    properties: {
        'id': {
            'type': 'string'
        },
        'code': {
            'type': 'string'
        },
        'user': {
            'type': 'string'
        },
        'image': {
            'type': 'object',
            'properties': {
                'url': {
                    'type': 'string'
                },
                'data': {
                    'type': 'string'
                }
            }
        },
        'firstName': {
            'type': 'string'
        },
        'lastName': {
            'type': 'string'
        },
        'email': {
            'type': 'string'
        },
        'phone': {
            'type': 'string'
        },
        'dob': {
            'type': 'string'
        },
        'gender': {
            'type': 'string'
        },
        'data': {
            'type': 'string'
        },
        'vacations': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'date': {
                        'type': 'date'
                    },
                    'reason': {
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
