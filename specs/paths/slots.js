module.exports = [{
    get: {
        'description': 'get agent timeSlots',
        'parameters': [
            'x-role-key',
            { name: 'agent', in: 'query', description: 'agent id', required: false, type: 'string' },
            { name: 'date', in: 'query', description: 'date', required: false, type: 'string' },
            { name: 'availabilityId', in: 'query', description: 'agent availability id', required: false, type: 'string' }
        ]
    }
}]
