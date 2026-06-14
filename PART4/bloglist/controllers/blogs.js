const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET ALL BLOGS
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})


// CREATE BLOG (JWT PROTECTED)
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  // 1. verify token
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  // 2. find user
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  // 3. validate blog
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  // 4. create blog
  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  // 5. attach blog to user
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})


// DELETE BLOG
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  // 🔐 ownership check
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(403).json({ error: 'not allowed to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

// UPDATE BLOG
blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
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