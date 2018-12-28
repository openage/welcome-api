const organization = require('./organizations')
const profile = require('./profiles')

module.exports = {
    id: 'string',
    phone: 'string',
    email: 'string',
    profile: profile,
    organization: organization
}