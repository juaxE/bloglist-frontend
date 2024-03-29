import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleLikes, handleBlogDeletion }) => {
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
        }, blog.id, blog.user)
    }

    const deleteBlog = (event) => {
        event.preventDefault()
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}? `)) {
            handleBlogDeletion(blog.id)
        }

    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const deleteButton = {
        color: 'red',
    }

    return (
        <div style={blogStyle} data-testid="blog">
            <p>{blog.title} {blog.author}
                <button onClick={toggleVisibility}>{visibleDetails ? 'hide' : 'view'}</button>
            </p>
            <div style={showWhenVisible} className='blogDetails'>
                <p>
                    <span>{blog.url}</span>
                </p>
                <p>
                    <span data-testid="likes">{blog.likes}</span>
                    <button onClick={addLike}>like</button>
                </p>
                <span>{blog.user.name}</span>
                {user.id === blog.user.id &&
                    <p>
                        <button style={deleteButton} onClick={deleteBlog}>remove blog</button>
                    </p>}
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleLikes: PropTypes.func.isRequired,
    handleBlogDeletion: PropTypes.func.isRequired,
}

export default Blog