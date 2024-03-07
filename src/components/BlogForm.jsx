import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ handleBlogSubmit }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        handleBlogSubmit({
            title: title,
            author: author,
            url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Add new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        data-testid="title"
                        onChange={({ target }) => setTitle(target.value)}
                    ></input>
                </div>
                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        data-testid="author"
                        onChange={({ target }) => setAuthor(target.value)}
                    ></input>
                </div>
                <div>
                    <label>Url:</label>
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        data-testid="url"
                        onChange={({ target }) => setUrl(target.value)}
                    ></input>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    handleBlogSubmit: PropTypes.func.isRequired
}

export default BlogForm