import { test, expect } from '@playwright/test'

test('direct load of a category route resolves the store', async ({ page }) => {
  const response = await page.goto('/category/cat-dairy')
  expect(response?.status()).toBe(200)
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /بقالة أبو قير/i })).toBeVisible({ timeout: 15_000 })
})
