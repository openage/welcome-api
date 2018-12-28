module.exports = [{
    name: 'visitorsReq',
    properties: {
        'image': {
            'type': 'string'
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
            'type': 'object'
        },
        'type': {
            'type': 'string'
        },
        'identities': {
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
            }

        },
        'organisation': {
            'type': 'string'
        }

    }
}]
