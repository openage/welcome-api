const profile = require('./profiles')

module.exports = {
    purpose: 'string',
    from: 'date',
    till: 'date',
    status: 'string',
    data: 'object',
    agent: {
        id: 'string'
    },
    visitor: {
        id: 'string',
        profile: profile
    },
    role: {
        id: 'string'
    }
}
