const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { BlogUser } = require('../models/blogUser')

router.post('/', async (request, response) => {
  const body = request.body
  const blogUser = await BlogUser.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'password'

  if (!(blogUser && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: blogUser.username,
    id: blogUser.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: blogUser.username, name: blogUser.name })
})

module.exports = router