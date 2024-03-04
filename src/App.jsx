import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState(null)


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

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setNotif(`A new blog ${title} by ${author} added`, "success")
        setTimeout(() => {
          clearNotif()
        }, 3000)
      })
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

  const createBlogForm = () => (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={handleBlogSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          ></input>
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          ></input>
        </div>
        <div>
          <label>Url:</label>
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          ></input>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
      {user && createBlogForm()}
      {user && blogList()}
    </div>
  )
}
export default App