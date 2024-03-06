import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visibleDetails, setVisibleDetails] = useState(false)

  const showWhenVisible = { display: visibleDetails ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails)
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
          <button onClick={() => console.log('liked')}>like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog