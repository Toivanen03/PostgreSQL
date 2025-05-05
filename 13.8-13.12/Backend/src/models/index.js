const { Blog } = require('../models/blog')
const { BlogUser } = require('../models/blogUser')

BlogUser.hasMany(Blog)
Blog.belongsTo(BlogUser)
Blog.sync({ alter: true })
BlogUser.sync({ alter: true })

module.exports = {
  Blog, BlogUser
}