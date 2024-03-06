import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotif("wrong credentials", "error")
      setTimeout(() => {
        clearNotif()
      }, 3000)
    }
  }

  const handleBlogSubmit = async (blogObject) => {

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotif(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, "success")
    blogFormRef.current.toggleVisibility()
    setTimeout(() => {
      clearNotif()
    }, 3000)
  }

  const handleLikes = async (changedBlog, id) => {
    const returnedBlog = await blogService.update(changedBlog, id)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const setNotif = (message, type) => {
    setNotifMessage(message)
    setNotifType(type)
  }

  const clearNotif = () => {
    setNotifMessage(null)
    setNotifType(null)
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          ></input>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          ></input>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes} />
      )}
    </div>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notifMessage} type={notifType} />
      {!user && loginForm()}
      {user &&
        <div>
          {user.username} logged in
          <form onSubmit={logOut}>
            <button type="submit">logout</button>
          </form>
        </div>}
      {user &&
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm handleBlogSubmit={handleBlogSubmit} />
        </Togglable>}
      {user && blogList()}
    </div>
  )
}
export default App