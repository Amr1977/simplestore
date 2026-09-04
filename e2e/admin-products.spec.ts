import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers'

test('admin products list is reachable and shows the seeded product', async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto('/admin/products')
  await expect(page).toHaveURL(/\/admin\/products/)
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.getByText('لبن كامل الدسم').first()).toBeVisible({ timeout: 15_000 })
})
