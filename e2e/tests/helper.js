const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByTestId('blog').filter({ hasText: title }).waitFor()
}
const initialBlogs = [
    {

        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 1,
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }
]

const likeBlog = async (page, title, likes) => {
    const blogLocator = await page.getByTestId('blog').filter({ hasText: title })
    await blogLocator.getByRole('button', { name: 'view' }).click()
    await page.waitForSelector('.blogDetails')
    const likesLocator = await blogLocator.getByTestId('likes').first()

    for (let i = 0; i < likes; i++) {
        await blogLocator.getByRole('button', { name: 'like' }).click()
        await expect(likesLocator).toHaveText(`${i + 1}`)
    }
    await expect(likesLocator).toHaveText(likes.toString())
}

const createBlogsWithLikes = async (page) => {
    for (const blog of initialBlogs) {
        await createBlog(page, blog.title, blog.author, blog.url)
        await likeBlog(page, blog.title, blog.likes)
    }
}

export { loginWith, createBlog, createBlogsWithLikes }