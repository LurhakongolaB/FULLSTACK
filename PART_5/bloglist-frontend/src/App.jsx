import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  // Load blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  // Restore logged-in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateLikes = async (blog) => {
  const changedBlog = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id
  }

  try {
    const returnedBlog = await blogService.update(
      blog.id,
      changedBlog
    )

    setBlogs(
      blogs.map(b =>
        b.id === blog.id ? returnedBlog : b
      )
    )
  } catch (exception) {
    showNotification('Error updating likes', 'error')
  }
}
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      showNotification(`Welcome ${user.name}`, 'success')

    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)

    showNotification('Logged out successfully', 'success')
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title,
        author,
        url
      }

      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      setTitle('')
      setAuthor('')
      setUrl('')

      showNotification('Blog created successfully', 'success')

    } catch (exception) {
      showNotification('Error creating blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />

        <h2>Log in to application</h2>

        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) =>
            setUsername(target.value)
          }
          handlePasswordChange={({ target }) =>
            setPassword(target.value)
          }
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />

      <h2>blogs</h2>

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      <h3>Create new blog</h3>

      <Togglable buttonLabel="new blog">

  <BlogForm addBlog={addBlog} />

  </Togglable>
      {blogs.map(blog => (
  <Blog
    key={blog.id}
    blog={blog}
    updateLikes={updateLikes}
  />
))}
    </div>
  )
}

export default App