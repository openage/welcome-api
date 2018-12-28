'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
const logger = require('@open-age/logger')('providers/directory')
const directoryConfig = require('config').get('providers.directory')

let parsedConfig = (config) => {
    config = config || {}

    return {
        url: config.url || directoryConfig.url,
        tenantKey: config.api_key || directoryConfig.api_key,
        lastSyncDate: config.lastSyncDate
    }
}

/*
const cloneUser = async (role) => { // create user and organization if not exist
    let log = logger.start('cloneUser')
    let claims = {}
    let userModel = {
        role: {
            id: role.id,
            key: role.key,
            permissions: role.permissions
        },
        authId: role.user.id,
        email: role.user.email,
        phone: role.user.phone,
        picUrl: role.user.picUrl,
        firstName: role.user.profile.firstName,
        lastName: role.user.profile.lastName,
        gender: role.user.profile.gender,
        dob: role.user.profile.dob
    }

    if (role.organization) {
        userModel.role.organization = {
            id: role.organization.id,
            name: role.organization.name,
            code: role.organization.code
        }
    }

    log.info('user_creation_model', userModel)

    let user = await db.user.findOrCreate({ 'role.id': role.id }, userModel)

    if (user.created) {
        log.info('new user created')
    } else {
        log.info('user already exist')
    }

    claims.user = user.result

    if (role.organization) {
        let organizationModel = {
            code: role.organization.code,
            name: role.organization.name
        }

        let organization = await db.organization.findOrCreate({ code: role.organization.code }, organizationModel)

        if (organization.created) {
            log.info('new organization created')
        } else {
            log.info('organization already exist')
        }

        claims.organization = organization.result
    }

    if (user.result.role.key !== role.key) {
        user.result.role.key = role.key
        await user.result.save()
    }

    return claims
}
*/
exports.getRole = (roleKey) => { // Get role from user dictatory
    let log = logger.start('getRole')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey
        }
    }

    let url = `${directoryConfig.url}/api/roles/my`
    log.info(`sending request to url: ${url}`)

    return new Promise((resolve, reject) => {
        return client.getPromise(url, args).then((response) => {
            log.end()
            if (!response || !response.data.isSuccess) {
                return reject(new Error(response.data.error || response.data.message))
            }
            return resolve(response.data.data)
        })
    })
}

exports.getRoleById = (id) => {
    let log = logger.start('getRoleById')

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-service-key': config.tenantKey
        }
    }

    return new Promise((resolve, reject) => {
        const url = `${config.url}/api/roles/${id}`

        return client.get(url, args, (data, response) => {
            log.end()
            if (!data || !data.isSuccess) {
                return reject(new Error(response.data.error || response.data.message))
            }
            return resolve(data.data)
        })
    })
}
// exports.cloneUser = cloneUser
