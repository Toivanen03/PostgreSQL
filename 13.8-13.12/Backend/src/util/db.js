const { DATABASE_URL } = require('./config')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
        },
    },
})

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to the database')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        return process.exit(1)
    }
    return null
}

module.exports = {
    connectDB,
    sequelize
}