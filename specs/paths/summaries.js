module.exports = [{
    get: {
        'description': 'get agent timeSlots',
        'parameters': [
            'x-role-key',
            { name: 'agentId', in: 'query', description: 'agent id', required: true, type: 'string' },
            { name: 'fromDate', in: 'query', description: 'date', required: true, type: 'string' },
            { name: 'tillDate', in: 'query', description: 'date', required: true, type: 'string' },
            { name: 'byMonth', in: 'query', description: 'boolean', required: false, type: 'string' }
        ]
    }
}]
