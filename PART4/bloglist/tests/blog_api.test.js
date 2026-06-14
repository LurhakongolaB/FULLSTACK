process.env.NODE_ENV = 'test'
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

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

// RESET DATABASE BEFORE EACH TEST
beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

// -------------------- GET TESTS --------------------

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
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

  const titles = response.body.map(b => b.title)
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


test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length - 1
  )
})

test('deleting non-existing blog returns 404', async () => {
  const fakeId = '507f1f77bcf86cd799439011'

  await api
    .delete(`/api/blogs/${fakeId}`)
    .expect(404)
})



after(async () => {
  await mongoose.connection.close()
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await api.get('/api/blogs')
  const updated = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updated.likes, blogToUpdate.likes + 1)
})