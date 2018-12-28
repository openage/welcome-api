module.exports = [{
    url: '/',
    post: {
        'description': 'create availability of agent with roleKey',
        'parameters': ['x-role-key']
    }
}, {
    url: '/{id}',
    put: {
        description: 'update appointment with roleKey',
        parameters: [
            'x-role-key',
            { name: 'id', in: 'path', description: 'availability id', required: true, type: 'string' }
        ]
    }

}, {
    url: '/agent/{id}',
    get: {
        'description': 'agent availability',
        'parameters': [
            'x-role-key',
            { name: 'id', in: 'path', description: 'agent id or my', required: true, type: 'string' }
        ],
    }
}]
