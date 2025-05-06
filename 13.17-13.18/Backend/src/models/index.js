const { Blog } = require('./blog')
const { BlogUser } = require('./blogUser')

BlogUser.hasMany(Blog)
Blog.belongsTo(BlogUser)

module.exports = {
  Blog, BlogUser
}