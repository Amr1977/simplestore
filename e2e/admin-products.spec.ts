import { test, expect } from '@playwright/test'

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/admin/login')
  await page.locator('input[type="email"]').fill('admin@test.local')
  await page.locator('input[type="password"]').fill('TestAdmin123!')
  await page.getByRole('button', { name: /تسجيل الدخول|دخول/i }).click()
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15_000 })
}

test('admin products list is reachable and shows the seeded product', async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto('/admin/products')
  await expect(page).toHaveURL(/\/admin\/products/)
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.getByText('لبن كامل الدسم').first()).toBeVisible({ timeout: 15_000 })
})
