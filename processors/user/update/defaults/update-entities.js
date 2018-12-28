'use strict'
const db = require('../../../../models')

exports.process = async (data, context) => {
    if (!data) {
        return
    }

    let user = await db.user.findById(data.id)

    if (!user) {
        return
    }

    let searchData = {
        phone: user.phone,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
    }

    let visitors = await db.visitor.find({ user: user.id })
    let agents = await db.agent.find({ user: user.id })

    let entities = visitors.concat(agents)

    for (let entity of entities) {
        entity.searchData = searchData
        await entity.save()
    }
}