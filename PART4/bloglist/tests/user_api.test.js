process.env.NODE_ENV = 'test'
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

// -------------------- INITIAL DATA --------------------

const initialUsers = [
  {
    username: 'user1',
    name: 'User One',
    password: 'password1'
  },
  {
    username: 'user2',
    name: 'User Two',
    password: 'password2'
  }
]

// -------------------- RESET DATABASE --------------------

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = initialUsers.map(u => new User(u))
  const promises = userObjects.map(u => u.save())

  await Promise.all(promises)
})

// -------------------- TESTS --------------------

test('users are returned as json', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.length >= 0)
})

test('valid user can be created', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Valid User',
    password: 'validpassword'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  assert.strictEqual(response.body.username, newUser.username)

  const usersAtEnd = await api.get('/api/users')
  const usernames = usersAtEnd.body.map(u => u.username)

  assert.ok(usernames.includes(newUser.username))
})

test('duplicate username is rejected', async () => {
  const newUser = {
    username: 'user1',
    name: 'Duplicate User',
    password: 'duplicatepassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(
    result.body.error.includes('unique')
  )
})

test('password shorter than 3 characters is rejected', async () => {
  const newUser = {
    username: 'shortpassuser',
    name: 'Short Password',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(
    result.body.error.includes('password')
  )
})

test('username shorter than 3 characters is rejected', async () => {
  const newUser = {
    username: 'ab',
    name: 'Too Short',
    password: 'validpassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.ok(
    result.body.error.includes('username')
  )
})

// -------------------- CLEANUP --------------------

after(async () => {
  await mongoose.connection.close()
})