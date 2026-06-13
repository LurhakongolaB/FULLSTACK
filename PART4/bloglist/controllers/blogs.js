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

blogsRouter.delete('/:id', async (req, res) => {
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id)

  if (!deletedBlog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.status(204).end()
})





module.exports = blogsRouter