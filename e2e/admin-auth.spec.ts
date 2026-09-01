import { test, expect } from '@playwright/test'

test('unauthenticated visit to /admin redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
  await expect(page.getByRole('heading', { name: 'تسجيل دخول المسؤول' })).toBeVisible({ timeout: 15_000 })
})

test('admin can sign in with the seeded test account', async ({ page }) => {
  await page.goto('/admin/login')
  await page.locator('input[type="email"]').fill('admin@test.local')
  await page.locator('input[type="password"]').fill('TestAdmin123!')
  await page.getByRole('button', { name: /تسجيل الدخول|دخول/i }).click()
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15_000 })
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
})
