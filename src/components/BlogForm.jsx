import { useState } from 'react'

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
}

export default BlogForm