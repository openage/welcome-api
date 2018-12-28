module.exports = [{
    name: 'queueTypeReq',
    properties: {
        'code': {
            'type': 'string'
        },
        'purpose': {
            'type': 'string'
        },
        'maxQueueSize': {
            'type': 'number'
        },
        'status': {
            'type': 'string'
        },
        'organization': {
            'type': 'object',
            'properties': {
                'id': {
                    'type': 'string'
                },
                'code': {
                    'type': 'string'
                }
            }
        },
        'schedule': {
            'type': 'object',
            'properties': {
                'monday': {
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
        },
        'agents': {
            'type': 'array',
            'items': {
                'type': 'string'
            }

        },
        'closedOn': {
            'type': 'array',
            'items': {
                'properties': {
                    'date': {
                        'type': 'date'
                    },
                    'reason': {
                        'type': 'string'
                    }
                }

            }
        }
    }
}]
