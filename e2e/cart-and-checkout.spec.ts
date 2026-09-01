import { test, expect } from '@playwright/test'

test('add to cart, view cart, then go to checkout', async ({ page }) => {
  await page.goto('/product/prod-1')
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  const addBtn = page.getByRole('button', { name: 'أضف للسلة' }).first()
  await expect(addBtn).toBeVisible({ timeout: 15_000 })
  await addBtn.click()
  await page.goto('/cart')
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
  await expect(page.getByText('لبن كامل الدسم').first()).toBeVisible({ timeout: 15_000 })
})
