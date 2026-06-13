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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New test blog',
    author: 'Alfred',
    url: 'https://newtest.com',
    likes: 10
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

test('blog content is saved correctly', async () => {
  const newBlog = {
    title: 'Content test',
    author: 'Tester',
    url: 'https://test.com',
    likes: 2
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(b => b.title)

  assert.strictEqual(titles.includes('Content test'), true)
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Tester',
    url: 'https://test.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'Missing URL blog',
    author: 'Tester',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})