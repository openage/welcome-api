module.exports = [{
    url: '/',
    'post': {
        'summary': 'Create Queue',
        'description': 'Create Queue',

        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'required': true,
                'schema': {
                    '$ref': '#/definitions/queueReq'
                }
            },
            {
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
    }
}]
