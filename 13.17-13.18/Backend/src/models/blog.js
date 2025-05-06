const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db') 

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
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1991,
      max: new Date().getFullYear()
    }
  }  
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Blog'
})

module.exports = { Blog }