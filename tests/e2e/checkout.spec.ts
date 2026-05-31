import { test, expect } from '@playwright/test'

test.describe('TC-005: Checkout Validation', () => {
  test('shows errors when submitting empty form', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('add-to-cart-beef-tehari').click()
    await page.goto('/checkout')

    // Skip step 1
    await page.getByTestId('step1-next').click()

    // Try to proceed without filling form
    await page.getByTestId('step2-next').click()

    // Error messages should appear
    await expect(page.getByTestId('error-name')).toBeVisible()
    await expect(page.getByTestId('error-phone')).toBeVisible()
    await expect(page.getByTestId('error-address')).toBeVisible()

    // Should NOT navigate away
    await expect(page).toHaveURL('/checkout')
  })
})

test.describe('TC-002: Area Selector', () => {
  test('selected area pre-fills checkout form', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('area-chip-banani').click()
    await expect(page.getByTestId('area-chip-banani')).toHaveAttribute('aria-pressed', 'true')

    await page.getByTestId('add-to-cart-beef-tehari').click()
    await page.goto('/checkout')
    await page.getByTestId('step1-next').click()

    const areaValue = await page.getByTestId('input-area').inputValue()
    expect(areaValue).toBe('banani')
  })
})
