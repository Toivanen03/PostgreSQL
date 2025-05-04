require('express-async-errors')
const errorHandler = require('../middleware/errorHandler')
const { Blog } = require('../models/blog')
const router = require('express').Router()

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})
  
router.get('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        console.log(req.blog.toJSON())
        res.json(req.blog)
    } else {
        const error = new Error('Blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})
  
router.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        req.blog.author = req.body.author || req.blog.author
        req.blog.url = req.body.url || req.blog.url
        req.blog.title = req.body.title || req.blog.title
        req.blog.likes = req.body.likes || req.blog.likes
        await req.blog.save()
        res.json(req.blog)
        console.log(req.blog.toJSON())
    } else {
        const error = new Error('Blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})
  
router.post('/', async (req, res, next) => {
    const blog = await Blog.create(req.body)
    if (blog) {
        return res.json(blog)
    } else {
        const error = new Error('Blog creation failed')
        error.name = 'SequelizeValidationError'
        return next(error)
    }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        await req.blog.destroy()
        res.status(204).end()
    } else {
        const error = new Error('Blog not found')
        error.name = 'NotFoundError'
        return next(error)
    }
})

router.use(errorHandler)
  
module.exports = router