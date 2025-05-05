require('express-async-errors')
const errorHandler = require('../middleware/errorHandler')
const { BlogUser, Blog } = require('../models')
const router = require('express').Router()
const { tokenExtractor } = require('../middleware/tokenExtractor')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id, {
        include: {
          model: BlogUser,
          attributes: ['id', 'username', 'name']
        }
      })
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: { exclude: ['blogUserId'] },
        include: {
            model: BlogUser,
            attributes: ['name']
        }
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
    const blogUser = await BlogUser.findByPk(req.decodedToken.id)
    if (blogUser && req.blog) {
        req.blog.author = req.body.author || req.blog.author
        req.blog.url = req.body.url || req.blog.url
        req.blog.title = req.body.title || req.blog.title
        req.blog.likes = req.body.likes || req.blog.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        const error = new Error('Not authorized or blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})

router.post('/', tokenExtractor, async (req, res, next) => {
    const blogUser = await BlogUser.findByPk(req.decodedToken.id)
    let blog = await Blog.create({...req.body, blogUserId: blogUser.id, date: new Date()})
    if (blog) {
        blog = await Blog.findByPk(blog.id, {
            include: {
              model: BlogUser,
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
    const blogUser = await BlogUser.findByPk(req.decodedToken.id)
    if (blogUser && req.blog) {
        if (blogUser.id === req.blog.blogUser.id) {
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