const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
// routes
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

// connect to MongoDB
logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// middleware (IMPORTANT ORDER)
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(express.static('dist'))
app.use(middleware.requestLogger)

// routes
app.use('/api/blogs',
  middleware.tokenExtractor, // tokenExtractor middleware is applied to /api/blogs route
  middleware.userExtractor, // userExtractor middleware is applied to /api/blogs route
  blogsRouter
)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use(middleware.tokenExtractor)

// unknown endpoint + error handler
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get('/', (req, res) => {
  res.send('Blog API is running')
})

module.exports = app