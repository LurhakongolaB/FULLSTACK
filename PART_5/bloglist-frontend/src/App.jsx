import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
  const loggedUserJSON =
    window.localStorage.getItem('loggedBlogappUser')

  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
  }
}, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      setUser(user)
      window.localStorage.setItem(
  'loggedBlogappUser',
  JSON.stringify(user)
)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert('Wrong username or password')
    }
  }

  if (user === null) {
    return (
      <div>
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
}

  return (
    <div>
      <h2>blogs</h2>

      <p>
  {user.name} logged in
  <button onClick={handleLogout}>
    logout
  </button>
</p>

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App