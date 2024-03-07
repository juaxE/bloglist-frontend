const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

    })
})