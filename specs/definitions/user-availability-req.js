module.exports = [{
    name: 'userAvailabilityReq',
    properties: {
        'monday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'time'
                },
                'endTime': {
                    'type': 'time'
                }
            }
        },
        'tuesday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        },
        'wednesday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        },
        'thursday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        },
        'friday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        },
        'saturday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        },
        'sunday': {
            'type': 'object',
            'properties': {
                'startTime': {
                    'type': 'date'
                },
                'endTime': {
                    'type': 'date'
                }
            }
        }

    }
}]
