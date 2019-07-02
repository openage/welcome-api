'use strict'

const queueTypeService = require('../../../../services/queue-types')
const bapSettingProvider = require('../../../../providers/bap/settings')
const agentService = require('../../../../services/agents')

exports.process = async (data, context) => {
    let log = context.logger.start('agent settings')

    let queueTypeId = data.type._doc ? data.type.id : data.type.toString()
    let queueType = await queueTypeService.getById(queueTypeId, context)

    let agentId = data.agent._doc ? data.agent.id : data.agent.toString()
    let agent = await agentService.getByIdOrContext(agentId, context)

    let model = {
        code: `${queueType.name}:${queueType.id}`,
        name: `${queueType.name}`,
        rate: [{
            code: 'price',
            value: data.appointment.fee,
            status: data.status,
            type: 'fixed'
        }],
        qualifier: {
            key: 'agent',
            value: agent.id
        },
        status: data.status,
        service: {
            code: 'welcome'
        }
    }

    return bapSettingProvider.create(model, agent.user.role.key, context).then((setting) => {
        log.info(`agent setting code ${setting.code} and id ${setting.id}`)
        data.bap = {
            id: setting.id
        }
        return data.save()
    })
} 
