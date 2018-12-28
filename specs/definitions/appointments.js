const organization = require('./organizations')
const role = require('./roles')
const profile = require('./profiles')

module.exports = {
    id: 'string',
    purpose: 'string',
    from: 'date',
    till: 'date',
    invoice: {
        id: 'string'
    },
    agent: {
        id: 'string',
        profile: profile,
        role: role
    },
    visitor: {
        id: 'string',
        profile: profile
    },
    organization: organization
}