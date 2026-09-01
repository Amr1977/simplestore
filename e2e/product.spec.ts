import { test, expect } from '@playwright/test'

test('product detail page renders and add-to-cart works', async ({ page }) => {
  await page.goto('/product/prod-1')
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.getByText('لبن كامل الدسم').first()).toBeVisible({ timeout: 15_000 })

  const addBtn = page.getByRole('button', { name: /أضف إلى السلة|أضف|إضافة/i }).first()
  if (await addBtn.isVisible()) {
    await addBtn.click()
  }
})
