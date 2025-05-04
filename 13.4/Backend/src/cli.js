require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.EXTERNAL_DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
})

sequelize.authenticate()
  .then(async () => {
    const [results] = await sequelize.query('SELECT * FROM blogs')
    results.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    await sequelize.close()
  })
  .catch(err => {
    console.error('Virhe: ', err)
  })