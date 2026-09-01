import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('loads the storefront and does not show the "store unavailable" fallback', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'بقالة أبو قير', level: 2 })).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
    await expect(page.getByText('الأقسام')).toBeVisible()
    await expect(page.getByText('منتجات مميزة')).toBeVisible()
  })

  test('product grid is non-empty', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'بقالة أبو قير', level: 2 })).toBeVisible({ timeout: 15_000 })
    const productLinks = page.locator('a[href^="/product/"]')
    await expect(productLinks.first()).toBeVisible()
    expect(await productLinks.count()).toBeGreaterThan(0)
  })
})
