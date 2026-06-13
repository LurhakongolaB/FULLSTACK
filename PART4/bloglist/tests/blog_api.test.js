const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Alfred',
    url: 'https://first.com',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'John',
    url: 'https://second.com',
    likes: 7
  }
]

const mongoose = require('mongoose')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

after(async () => {
  await mongoose.connection.close()
})

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
  })
}) 