import { test, expect } from '@playwright/test'

test.describe('TC-001: Full Happy Path Order', () => {
  test('user can complete a full order flow', async ({ page }) => {
    await page.goto('/')

    // Select area
    await page.getByTestId('area-chip-gulshan').click()
    await expect(page.getByTestId('area-chip-gulshan')).toHaveAttribute('aria-pressed', 'true')

    // Add beef tehari to cart
    await page.getByTestId('add-to-cart-beef-tehari').click()

    // Add chicken biryani to cart
    await page.getByTestId('add-to-cart-chicken-biryani').click()

    // Open cart drawer
    await page.getByTestId('open-cart-drawer').click()
    await expect(page.getByTestId('cart-drawer')).toBeVisible()

    // Verify 2 items
    await expect(page.getByTestId('cart-item-beef-tehari')).toBeVisible()
    await expect(page.getByTestId('cart-item-chicken-biryani')).toBeVisible()

    // Proceed to checkout
    await page.getByTestId('proceed-checkout-btn').click()
    await page.waitForURL('/checkout')

    // Step 1 — confirm cart, click Next
    await page.getByTestId('step1-next').click()

    // Step 2 — fill delivery details
    await page.getByTestId('input-name').fill('Test User')
    await page.getByTestId('input-phone').fill('01711-123456')
    await page.getByTestId('input-area').selectOption('gulshan')
    await page.getByTestId('input-address').fill('House 5, Road 3, Gulshan-1')
    await page.getByTestId('step2-next').click()

    // Step 3 — place order
    await expect(page.getByTestId('place-order-btn')).toBeVisible()
    await page.getByTestId('place-order-btn').click()

    // Confirmation page
    await page.waitForURL('/confirmation')
    await expect(page.getByTestId('order-number')).toBeVisible()
    await expect(page.getByTestId('order-number')).toContainText('BC-')
  })
})
