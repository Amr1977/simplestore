import { test, expect } from '@playwright/test'

test.describe('Category page', () => {
  test('clicking a category from the home page navigates to /category/:id', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'بقالة أبو قير', level: 2 })).toBeVisible({ timeout: 15_000 })
    const categoryLink = page.locator('a[href^="/category/"]').first()
    await categoryLink.click()
    await expect(page).toHaveURL(/\/category\//)
    await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  })
})
