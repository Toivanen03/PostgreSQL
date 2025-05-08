const jwt = require('jsonwebtoken')
const { Session} = require('../models')
const { SECRET } = require('../util/config')

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7)
      try {
        req.decodedToken = jwt.verify(token, SECRET)
        const session = await Session.findOne({
          where: {
            sessionToken: token,
            active: true
          }
        })
    
        if (!session) {
          return res.status(401).json({ error: 'invalid or expired session' })
        }
        req.token = req.decodedToken
        req.session = session

      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { tokenExtractor }