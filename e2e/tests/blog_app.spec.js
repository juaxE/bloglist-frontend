const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, createBlogsWithLikes } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Log in to application')).toBeVisible()
    })

    describe('Login', () => {

        test('Succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('Fails with incorrect credentials', async ({ page }) => {
            await loginWith(page, 'mluuk', 'salainen')
            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })

    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Console open', 'Matti Luukkainen', 'fullstackopen.com')
            await expect(page.getByText('Console open Matti Luukkainen')).toBeVisible()
        })

        test('two new blogs can be created', async ({ page }) => {
            await createBlog(page, 'Console open', 'Matti Luukkainen', 'fullstackopen.com')
            await createBlog(page, 'Monitor off', 'Luukka Mattinen', 'fullstackclosed.com')
            await expect(page.getByText('Console open Matti Luukkainen')).toBeVisible()
            await expect(page.getByText('Monitor off Luukka Mattinen')).toBeVisible()
        })
    })

    describe('When blogs have been created', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await createBlog(page, 'Console open', 'Matti Luukkainen', 'fullstackopen.com')
            await createBlog(page, 'Monitor off', 'Luukka Mattinen', 'fullstackclosed.com')
        })

        test('Blog can be liked', async ({ page }) => {
            const blogLocator = await page.getByTestId('blog').first()

            await blogLocator.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.blogDetails')

            await blogLocator.getByRole('button', { name: 'like' }).click()
        })

        test('Likes number updates', async ({ page }) => {
            const blogLocator = await page.getByTestId('blog').first()

            await blogLocator.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.blogDetails')

            await blogLocator.getByRole('button', { name: 'like' }).click()

            const likesLocator = await blogLocator.getByTestId('likes').first()
            await expect(likesLocator).toHaveText('1')
        })

        test('Blog can be deleted', async ({ page }) => {
            const firstBlog = await page.getByTestId('blog').first()

            await firstBlog.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.blogDetails')

            page.on('dialog', dialog => dialog.accept())
            await firstBlog.getByRole('button', { name: 'remove blog' }).click()

            const blogLocator = await page.getByTestId('blog')
            await expect(blogLocator).toHaveCount(1)
        })

        test('Blog remove button is visible for creator', async ({ page }) => {
            const firstBlog = await page.getByTestId('blog').first()

            await firstBlog.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.blogDetails')

            const removeButtonLocator = await firstBlog.getByRole('button', { name: 'remove blog' })

            await expect(removeButtonLocator).toHaveCount(1)
        })

        test('Blog remove button is not visible for others', async ({ page, request }) => {
            await request.post('/api/users', {
                data: {
                    name: 'Murto Tieto',
                    username: 'hackerman',
                    password: 'secure'
                }
            })
            await page.goto('/')
            await page.getByRole('button', { name: 'logout' }).click()

            await loginWith(page, 'hackerman', 'secure')

            const firstBlog = await page.getByTestId('blog').first()

            await firstBlog.getByRole('button', { name: 'view' }).click()
            await page.waitForSelector('.blogDetails')

            const removeButtonLocator = await firstBlog.getByRole('button', { name: 'remove blog' })

            await expect(removeButtonLocator).toHaveCount(0)
        })

    })

    describe('When blogs have likes', () => {
        beforeEach(async ({ page }) => {
            test.setTimeout(120000)
            await loginWith(page, 'mluukkai', 'salainen')
            await createBlogsWithLikes(page)
            await page.goto('/')
        })

        test('Blogs are sorted by likes', async ({ page }) => {
            const blogsLocator = await page.getByTestId('blog')
            const blogsSize = await blogsLocator.count()
            for (let i = 0; i < blogsSize; i++) {
                await blogsLocator.nth(i).getByRole('button', { name: 'view' }).click()
            }

            const likesLocator = await page.getByTestId('likes')
            for (let i = 0; i < blogsSize - 1; i++) {
                const currentIndexLikes = await likesLocator.nth(i).textContent()
                const nextIndexLikes = await likesLocator.nth(i - 1).textContent()

                const currentAsInt = parseInt(currentIndexLikes)
                const nextAsInt = parseInt(nextIndexLikes)

                expect(currentAsInt).toBeGreaterThanOrEqual(nextAsInt)
            }


        })
    })
})