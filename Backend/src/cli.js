require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

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

sequelize.authenticate()
  .then(async () => {
    const [results, metadata] = await sequelize.query('SELECT * FROM blogs')
    results.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    await sequelize.close()
  })
  .catch(err => {
    console.error('Virhe: ', err)
  })