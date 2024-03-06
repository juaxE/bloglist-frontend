import { render, screen } from '@testing-library/react'

import Blog from './Blog'

test('renders title', () => {
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

    render(<Blog blog={blog} />)

    const element = screen.getByText('Canonical string reduction Edsger W. Dijkstra')
    expect(element).toBeDefined()
})