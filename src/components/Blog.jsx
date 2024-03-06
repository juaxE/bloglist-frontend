import { useState } from 'react'

const Blog = ({ blog, handleLikes }) => {
  const [visibleDetails, setVisibleDetails] = useState(false)

  const showWhenVisible = { display: visibleDetails ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails)
  }

  const addLike = (event) => {
    event.preventDefault()
    const newLikes = blog.likes + 1
    handleLikes({
      user: blog.user.id,
      likes: newLikes,
      title: blog.title,
      author: blog.author,
      url: blog.url
    }, blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p>{blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visibleDetails ? 'hide' : 'view'}</button>
      </p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes}
          <button onClick={addLike}>like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog