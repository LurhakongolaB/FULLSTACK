const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET ALL BLOGS (PUBLIC)
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })

  res.json(blogs)
})


// CREATE BLOG (AUTH REQUIRED)
blogsRouter.post('/', async (req, res) => {
  const user = req.user
  const body = req.body

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})


// DELETE BLOG (OWNER ONLY)
blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'not allowed to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})


// UPDATE BLOG

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  if (!updatedBlog) {
    return res.status(404).end()
  }

  res.json(updatedBlog)
})
module.exports = blogsRouter