require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(middleware.tokenExtract)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)

app.use(middleware.error)
app.use(middleware.unknownEndpoint)

const runPort = PORT || 3001

const start = () => {
  connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Running on port ${runPort}`)
  })
}

start()
