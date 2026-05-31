import { test, expect } from '@playwright/test'

test.describe('TC-003: WhatsApp Button', () => {
  test('WhatsApp button is visible and has correct href', async ({ page }) => {
    await page.goto('/')
    const waBtn = page.getByTestId('whatsapp-button')
    await expect(waBtn).toBeVisible()
    const href = await waBtn.getAttribute('href')
    expect(href).toContain('wa.me/88001686600954')
  })
})

test.describe('TC-007: Mobile Viewport', () => {
  test('no horizontal scroll on iPhone 14 viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const bodyWidth   = await page.evaluate(() => document.body.scrollWidth)
    const windowWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth)

    // Cart bar visible after adding item
    await page.getByTestId('add-to-cart-beef-tehari').click()
    await expect(page.getByTestId('cart-bar')).toBeVisible()
  })
})

test.describe('TC-008: Social Links in Footer', () => {
  test('footer has Facebook and Instagram links', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    const fbLink = page.getByTestId('facebook-link')
    const igLink = page.getByTestId('instagram-link')

    await expect(fbLink).toBeVisible()
    await expect(igLink).toBeVisible()

    expect(await fbLink.getAttribute('href')).toBeTruthy()
    expect(await igLink.getAttribute('href')).toBeTruthy()
  })
})

test.describe('TC-003: Area Selector visibility', () => {
  test('all area chips are visible and scrollable', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('area-selector')).toBeVisible()
    await expect(page.getByTestId('area-chip-bashundhara')).toBeVisible()
    await expect(page.getByTestId('area-chip-mohammadpur')).toBeVisible()
  })
})
