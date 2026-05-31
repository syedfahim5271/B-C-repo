import { test, expect } from '@playwright/test'

test.describe('TC-004: Cart Persistence', () => {
  test('cart survives page reload via localStorage', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('add-to-cart-beef-tehari').click()
    await page.getByTestId('add-to-cart-chicken-biryani').click()
    await expect(page.getByTestId('cart-count')).toHaveText('2')

    await page.reload()

    await expect(page.getByTestId('cart-bar')).toBeVisible()
    await expect(page.getByTestId('cart-count')).toHaveText('2')
  })
})

test.describe('TC-006: Quantity Controls', () => {
  test('quantity stepper works correctly in cart drawer', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('add-to-cart-beef-tehari').click()

    // Open cart drawer
    await page.getByTestId('open-cart-drawer').click()
    await expect(page.getByTestId('cart-drawer')).toBeVisible()

    // Increase
    await page.getByTestId('drawer-increase-beef-tehari').click()
    // Decrease
    await page.getByTestId('drawer-decrease-beef-tehari').click()
    // Remove
    await page.getByTestId('drawer-decrease-beef-tehari').click()

    // Item removed — cart should be empty
    await expect(page.getByTestId('cart-item-beef-tehari')).not.toBeVisible()
  })
})
