import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers'

test('admin can upload a new primary image to a product', async ({ page, context }) => {
  // Stub Cloudinary so the test does not actually upload to production.
  await context.route('https://api.cloudinary.com/**', async route => {
    const fakePublicId = `stores/abu-qir-demo/products/e2e-${Date.now()}`
    const fakeVersion = String(Date.now())
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        public_id: fakePublicId,
        secure_url: `https://res.cloudinary.com/test-cloud/image/upload/v${fakeVersion}/${fakePublicId}.png`,
        width: 1024,
        height: 1024,
        format: 'png',
        resource_type: 'image',
        version: fakeVersion,
      }),
    })
  })

  await loginAsAdmin(page)
  await page.goto('/admin/products')
  await expect(page.getByText('لبن كامل الدسم').first()).toBeVisible({ timeout: 15_000 })

  // Open the product edit form by clicking the edit button on the first row
  await page.getByRole('button', { name: 'تعديل' }).first().click()
  await page.waitForURL(/\/admin\/products\/.+\/edit/, { timeout: 15_000 })
  await expect(page.getByLabel('اسم المنتج')).toBeVisible({ timeout: 15_000 })

  // Upload a file via the hidden file input
  const fileInput = page.locator('input[type="file"][accept="image/*"]').first()
  await fileInput.setInputFiles({
    name: 'test-upload.png',
    mimeType: 'image/png',
    buffer: Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    ]),
  })

  // The new image should appear in the media manager
  await expect(page.locator('img[src*="e2e-"]').first()).toBeVisible({ timeout: 15_000 })

  // No error banner
  await expect(page.getByText('فشل رفع الصورة')).toHaveCount(0)

  // Save
  await page.getByRole('button', { name: /تحديث المنتج|إضافة المنتج/ }).click()
  await page.waitForURL(/\/admin\/products\/?$/, { timeout: 15_000 })
})
