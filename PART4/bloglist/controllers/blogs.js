const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})

blogsRouter.post('/', async (req, res) => {
  const blog = req.body

  console.log('BODY:', blog)

  if (!blog.title || !blog.url) {
    return res.status(400).json({
      error: 'title or url missing'
    })
  }

  const newBlog = new Blog({
    title: blog.title,
    url: blog.url,
    author: blog.author,
    likes: blog.likes || 0
  })

  const savedBlog = await newBlog.save()
  res.status(201).json(savedBlog)
})

module.exports = blogsRouter