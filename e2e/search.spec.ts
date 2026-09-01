import { test, expect } from '@playwright/test'

test('search page renders', async ({ page }) => {
  await page.goto('/search')
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.locator('input[placeholder*="منتجات"]')).toBeVisible({ timeout: 15_000 })
})
