const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../middleware/tokenExtractor')
const errorHandler = require('../middleware/errorHandler')

router.get('/', async (req, res) => {
    const readingList = await ReadingList.findAll({
        attributes: {
            exclude: ['userId', 'blogId', 'createdAt', 'updatedAt']
        }
    })
    res.json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const readings = await ReadingList.findOne({
        where: {
            id: Number(req.params.id),
            userId: req.decodedToken.id
        }
    })
    readings.read = req.body.read
    await readings.save()
    res.json(readings)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    const blogId = req.body.blogId
    if (blogId && req.decodedToken) {
        const readingList = await ReadingList.create({
            blogId: blogId,
            userId: req.decodedToken.id
        })
        res.status(201).json(readingList)
    } else {
        const error = new Error('Not authorized or missing blog id')
        error.name = 'NotFoundError'
        return next(error)
    }
    })

router.use(errorHandler)

module.exports = router