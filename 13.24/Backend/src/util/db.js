const { DATABASE_URL } = require('./config')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

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
        await runMigrations()
        console.log('Connected to the database')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        return process.exit(1)
    }
    return null
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    })
}

const migrationConf = {
    migrations: {
        glob: './src/migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'blogMigrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

module.exports = {
    connectDB,
    sequelize
}