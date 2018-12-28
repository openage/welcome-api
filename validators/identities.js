exports.canCreate = async (req) => {
    if (!req.body.name) {
        return 'name is required.'
    }
}

exports.canUpdate = async (req) => {
    if (!req.body.name) {
        return 'name is required.'
    }
}
