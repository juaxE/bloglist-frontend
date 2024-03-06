import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

const blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 5,
    user: {
        username: 'john',
        name: 'john smith',
        id: '123'
    }
}

test('renders title', () => {
    render(<Blog blog={blog} />)
    const element = screen.getByText('Canonical string reduction Edsger W. Dijkstra')
    expect(element).toBeDefined()
})

test('details aren\'t visible at first', async () => {


    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display:none')
})

test('details become visible when button clicked', async () => {


    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
    expect(element).toBeDefined()

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display:none')
})

test('function is called when button clicked', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} handleLikes={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})