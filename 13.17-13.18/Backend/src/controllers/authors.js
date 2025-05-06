const { Blog } = require('../models')
const { fn, col } = require('sequelize')

const getAuthors = async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[fn('SUM', col('likes')), 'DESC']]
  })

  res.json(authors.map(a => ({
    author: a.author,
    articles: a.dataValues.articles,
    likes: a.dataValues.likes
  })))
}

module.exports = getAuthors