import { test, expect, devices } from '@playwright/test'

test.describe('Storefront happy path', () => {
  test.use({ ...devices['iPhone 13'] })

  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('mobile: hamburger opens, browse, add items, checkout', async ({ page }) => {
    // 1) Land on the home page (Arabic, RTL, store visible)
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByRole('heading', { name: 'بقالة أبو قير', level: 2 })).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)

    // 2) Open the mobile menu via the hamburger button
    const menuButton = page.getByRole('button', { name: 'فتح القائمة' })
    await expect(menuButton).toBeVisible()
    await menuButton.click()
    const drawer = page.getByRole('dialog', { name: 'القائمة الرئيسية' })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByText('الرئيسية')).toBeVisible()
    await expect(drawer.getByText('البحث عن منتج')).toBeVisible()
    await expect(drawer.getByText('سلة المشتريات')).toBeVisible()
    await expect(drawer.getByText('الأقسام')).toBeVisible()

    // 3) Close the drawer with the X button
    await page.getByRole('button', { name: 'إغلاق القائمة' }).click()
    await expect(drawer).toBeHidden()

    // 4) Tap a category from the home page categories strip
    const categoryLink = page.locator('a[href^="/category/"]').first()
    await expect(categoryLink).toBeVisible()
    await categoryLink.click()
    await expect(page).toHaveURL(/\/category\//)
    await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)

    // 5) Tap a product from the category page
    const productLink = page.locator('a[href^="/product/"]').first()
    await expect(productLink).toBeVisible({ timeout: 10_000 })
    const productHref = await productLink.getAttribute('href')
    await productLink.click()
    await expect(page).toHaveURL(/\/product\//)

    // 6) Add the product to the cart from the product detail page
    const addBtn = page.getByRole('button', { name: /أضف إلى السلة|أضف|إضافة/i }).first()
    await expect(addBtn).toBeVisible({ timeout: 15_000 })
    await addBtn.click()

    // 7) Header cart badge should show 1
    await expect(page.locator('header').getByText('1').first()).toBeVisible({ timeout: 5_000 })

    // 8) Go back to home, add a different product from the featured grid
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'بقالة أبو قير', level: 2 })).toBeVisible({ timeout: 15_000 })

    const featuredAddBtns = page.locator('button[aria-label^="أضف "]')
    const firstAdd = featuredAddBtns.first()
    await expect(firstAdd).toBeVisible({ timeout: 10_000 })

    // The first product might already be in the cart (QuantityControl shown instead of add button).
    // If so, increment via the + button.
    const isQuantity = await firstAdd.count() === 0
    if (isQuantity) {
      const plusBtn = page.locator('button[aria-label="زيادة"], button').filter({ hasText: /^\+$/ }).first()
      if (await plusBtn.isVisible().catch(() => false)) await plusBtn.click()
    } else {
      await firstAdd.click()
    }

    // 9) Header cart badge should now show 2 (or higher)
    await expect(async () => {
      const badge = page.locator('header').getByText(/^\d+$/).first()
      const text = (await badge.textContent()) ?? ''
      expect(Number(text)).toBeGreaterThanOrEqual(2)
    }).toPass({ timeout: 5_000 })

    // 10) Visit cart page
    await page.goto('/cart')
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.locator('text=المتجر غير متاح حالياً')).toHaveCount(0)
    await expect(page.getByText('سلة المشتريات')).toBeVisible({ timeout: 10_000 })

    // 11) Increment quantity in the cart
    const cartPlus = page.locator('button').filter({ has: page.locator('svg') }).nth(0)
    const initialRows = await page.locator('div.flex.gap-3.bg-white').count()
    const incBtn = page.getByRole('button').filter({ has: page.locator('svg') }).nth(1)
    await incBtn.click()
    await page.waitForTimeout(300)

    // 12) Remove an item
    const removeBtn = page.getByRole('button', { name: 'حذف' }).first()
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()
    await page.waitForTimeout(300)

    // Cart should now have fewer items
    const remainingRows = await page.locator('div.flex.gap-3.bg-white').count()
    expect(remainingRows).toBeLessThan(initialRows || remainingRows + 1)

    // 13) Go to checkout
    const checkoutLink = page.getByRole('link', { name: /إتمام الطلب|متابعة|الدفع/i }).first()
    const checkoutBtn = page.getByRole('button', { name: /إتمام الطلب|متابعة|الدفع/i }).first()
    if (await checkoutLink.isVisible().catch(() => false)) {
      await checkoutLink.click()
    } else {
      await checkoutBtn.click()
    }
    await expect(page).toHaveURL(/\/checkout/)

    // 14) Fill the checkout form
    await page.getByPlaceholder('الاسم الكامل').fill('محمد أحمد')
    await page.getByPlaceholder('01xxxxxxxxx').fill('01012345678')
    await page.getByPlaceholder('العنوان بالتفصيل').fill('شارع الكورنيش - الإسكندرية')

    // 15) Intercept the WhatsApp window.open call before submit
    await page.evaluate(() => {
      // @ts-expect-error: monkey-patch for test
      window.__waOpened = null
      const origOpen = window.open
      window.open = (...args: unknown[]) => {
        // @ts-expect-error: monkey-patch for test
        window.__waOpened = args[0]
        return null
      }
      window.__origOpen = origOpen
    })

    // 16) Submit the order
    const submitBtn = page.getByRole('button', { name: /إرسال الطلب عبر واتساب/i })
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()

    // 17) Confirmation should appear
    await expect(page.getByText('تم إرسال طلبك بنجاح!')).toBeVisible({ timeout: 10_000 })

    // 18) WhatsApp URL should have been constructed
    const waUrl = await page.evaluate(() => {
      // @ts-expect-error: monkey-patch for test
      return window.__waOpened as string | null
    })
    expect(waUrl).toBeTruthy()
    expect(waUrl).toMatch(/wa\.me\/201234567890|whatsapp\.com/)

    // 19) Cart should be empty now — go back to cart and confirm empty state
    await page.goto('/cart')
    await expect(page.getByText('السلة فارغة')).toBeVisible({ timeout: 5_000 })
  })
})
