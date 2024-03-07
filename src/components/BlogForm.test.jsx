import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


test('The function receives correct data', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()
    render(<BlogForm handleBlogSubmit={mockHandler} />)

    const title = screen.getByTestId('title')
    const author = screen.getByTestId('author')
    const url = screen.getByTestId('url')
    const submitButton = screen.getByText('create')

    await user.type(title, 'Canonical string reduction')
    await user.type(author, 'Edsger W. Dijkstra')
    await user.type(url, 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
    await user.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toStrictEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    })
})