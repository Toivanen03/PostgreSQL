require('express-async-errors')
const errorHandler = require('../middleware/errorHandler')
const { User, Blog } = require('../models')
const router = require('express').Router()
const { tokenExtractor } = require('../middleware/tokenExtractor')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id, {
        include: {
          model: User,
          attributes: ['id', 'username', 'name']
        }
      })
    next()
}

router.get('/', async (req, res) => {
    const where = {}
    if (req.query.search) {
        where[Op.or] = [
          {
            title: {
              [Op.iLike]: `%${req.query.search}%`
            }
          },
          {
            author: {
              [Op.iLike]: `%${req.query.search}%`
            }
          }
        ]
      }
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})
  
router.get('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        const error = new Error('Blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})
  
router.put('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (user && req.blog) {
        req.blog.author = req.body.author || req.blog.author
        req.blog.url = req.body.url || req.blog.url
        req.blog.title = req.body.title || req.blog.title
        req.blog.likes = req.body.likes || req.blog.likes
        req.blog.year = req.body.year || req.blog.year
        await req.blog.save()
        res.json(req.blog)
    } else {
        const error = new Error('Not authorized or blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})

router.post('/', tokenExtractor, async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    let blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    if (blog) {
        blog = await Blog.findByPk(blog.id, {
            include: {
              model: User,
              attributes: ['name']
            }
          })
        return res.json(blog)
    } else {
        const error = new Error('Unauthorized user or invalid data')
        error.name = 'SequelizeValidationError'
        return next(error)
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (user && req.blog) {
        if (user.id === req.blog.user.id) {
            await req.blog.destroy()
            res.status(204).end()
        } else {
            const error = new Error('Not authorized to delete this blog')
            error.name = 'NotAuthorizedError'
            return next(error)
        }
    } else {
        const error = new Error('Not authorized or blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})

router.use(errorHandler)
  
module.exports = router