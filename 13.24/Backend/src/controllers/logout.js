const { Session } = require('../models')

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    await Session.destroy({
        where: {
            sessionToken: token,
            active: true
        }
    })

    res.status(204).end()
}

module.exports = logout