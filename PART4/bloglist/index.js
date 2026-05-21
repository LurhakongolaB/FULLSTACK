require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

// MongoDB connection
const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB:', err.message)
  })

// Blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema) 

// 📥 GET all blogs

app.get('/api/blogs', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})


//  ➕ POST new blog

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body)

  blog.save().then(saved => {
    res.json(saved)
  })
})

// 🚀 START SERVER

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})