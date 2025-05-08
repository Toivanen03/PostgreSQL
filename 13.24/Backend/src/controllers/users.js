const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const errorHandler = require('../middleware/errorHandler')
const { tokenExtractor } = require('../middleware/tokenExtractor')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
          model: Blog,
          attributes: { exclude: ['userId'] }
        }
      })
    res.json(users)
})

router.post('/', async (req, res, next) => {
  const user = await User.create(req.body)
  if (user) {
    res.json(user)
  } else {
    const error = new Error('Invalid user data')
    return next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      through: {
        attributes: ['read', 'id'],
        where
      },
    },
  })
  if (user) {
    res.json(user)
  } else {
    const error = new Error('User not found')
    error.name = 'NotFoundError'
    return next(error)
  }
})

router.put('/:username', tokenExtractor, async (req, res, next) => {
  const user = await User.findOne({
    where: {  username: req.params.username,
              id: req.decodedToken.id
      }
  })
  if (user && req.body.username) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
      const error = new Error('Not authorized or missing username')
      error.name = 'NotFoundError'
      return next(error)
  }
})

router.use(errorHandler)

module.exports = router