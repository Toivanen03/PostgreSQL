const router = require('express').Router()
const { BlogUser, Blog } = require('../models')
const errorHandler = require('../middleware/errorHandler')
const { tokenExtractor } = require('../middleware/tokenExtractor')

router.get('/', async (req, res) => {
    const blogUsers = await BlogUser.findAll({
        include: {
          model: Blog,
          attributes: { exclude: ['blogUserId'] }
        }
      })
    res.json(blogUsers)
})

router.post('/', async (req, res, next) => {
  const blogUser = await BlogUser.create(req.body)
  if (blogUser) {
    res.json(blogUser)
  } else {
    const error = new Error('Invalid user data')
    return next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const blogUser = await BlogUser.findByPk(req.params.id)
  if (blogUser) {
    res.json(blogUser)
  } else {
    const error = new Error('User not found')
    error.name = 'NotFoundError'
    return next(error)
}
})

router.put('/:username', tokenExtractor, async (req, res, next) => {
    const blogUser = await BlogUser.findOne({
      where: {  username: req.params.username,
                id: req.decodedToken.id
       }
    })
    if (blogUser && req.body.username) {
      blogUser.username = req.body.username
      await blogUser.save()
      res.json(blogUser)
    } else {
        const error = new Error('Not authorized or missing username')
        error.name = 'NotFoundError'
        return next(error)
    }
})

router.use(errorHandler)

module.exports = router