const express = require('express')
const app = express()
const { PORT } = require('./util/config')
const { connectDB } = require('./util/db')
const blogsRouter = require('./controllers/blogs')

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const start = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Error connecting to database:', error)
    }
}

start()