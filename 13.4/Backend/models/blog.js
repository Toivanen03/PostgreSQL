require('dotenv').config()
const { Model, DataTypes, Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.EXTERNAL_DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
        },
    },
})

class Blog extends Model {}
Blog.init({
  author: DataTypes.STRING,
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'Blog'
})

Blog.sync()

module.exports = { Blog }