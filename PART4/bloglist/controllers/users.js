const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // 1. required fields
  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required'
    })
  }

  // 2. username length
  if (username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  // 3. password length
  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  // 4. uniqueness check
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  // 5. hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // 6. create user
  const user = new User({
    username,
    name,
    passwordHash,
    blogs: []
  })

  const savedUser = await user.save()

  return response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter