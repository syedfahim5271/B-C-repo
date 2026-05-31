# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order-flow.spec.ts >> TC-001: Full Happy Path Order >> user can complete a full order flow
- Location: tests/e2e/order-flow.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('order-number')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('order-number')

```

```yaml
- banner:
  - link "Biryani & Chill home":
    - /url: /
    - img "Biryani & Chill"
  - link "Biryani & Chill":
    - /url: /
  - link "My Orders":
    - /url: /orders
    - img
    - text: My Orders 1
  - link "Call us":
    - /url: tel:+88001686600954
  - link "Order on WhatsApp":
    - /url: https://wa.me/88001686600954?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A
- main:
  - img "Biryani & Chill"
  - text: 🔥 Limited Offer
  - heading "First order? 10% off" [level=2]
  - paragraph: Use code FIRSTORDER at checkout.
  - paragraph: Also try CHILL20 for ৳20 off
  - region "Select delivery area":
    - paragraph: Deliver to
    - button "📍 Bashundhara"
    - button "🏙️ Uttara"
    - button "✨ Gulshan" [pressed]
    - button "🌿 Banani"
    - button "🎨 Dhanmondi"
    - button "🏘️ Mirpur"
    - button "🌆 Mohakhali"
    - button "🕌 Mohammadpur"
  - heading "Our Menu biryani" [level=2]:
    - text: Our Menu
    - img "biryani"
  - paragraph: Dhaka's tastiest biryani, tehari & khichuri — delivered fast.
  - region "Menu":
    - article:
      - img "Beef Tehari"
      - text: 🔥 Popular
      - heading "Beef Tehari" [level=3]
      - paragraph: Slow-cooked beef in aromatic saffron rice
      - text: ৳190
      - button "Add Beef Tehari to cart": Add
    - article:
      - img "Chicken Biryani / Tehari"
      - text: Bestseller
      - heading "Chicken Biryani / Tehari" [level=3]
      - paragraph: Tender chicken with fragrant basmati rice
      - text: ৳170
      - button "Add Chicken Biryani / Tehari to cart": Add
    - article:
      - img "Chicken Khichuri"
      - heading "Chicken Khichuri" [level=3]
      - paragraph: Comfort khichuri with juicy chicken pieces
      - text: ৳170
      - button "Add Chicken Khichuri to cart": Add
    - article:
      - img "Beef Khichuri"
      - heading "Beef Khichuri" [level=3]
      - paragraph: Rich beef khichuri, slow-cooked perfection
      - text: ৳190
      - button "Add Beef Khichuri to cart": Add
- contentinfo:
  - paragraph: Biryani & Chill
  - paragraph: Hot. Hygienic. Heart-stealing.
  - paragraph: Follow Us
  - link "Facebook":
    - /url: https://www.facebook.com/biryaniandchill/
    - img
  - link "Instagram":
    - /url: https://www.instagram.com/biryaniandchill.bd/
    - img
  - link "Call us":
    - /url: tel:+88001686600954
  - link "WhatsApp":
    - /url: https://wa.me/88001686600954?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A
  - text: © 2026 Biryani & Chill. All rights reserved.
- alert: Biryani & Chill — Hot biryani. Zero drama.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('TC-001: Full Happy Path Order', () => {
  4  |   test('user can complete a full order flow', async ({ page }) => {
  5  |     await page.goto('/')
  6  | 
  7  |     // Select area
  8  |     await page.getByTestId('area-chip-gulshan').click()
  9  |     await expect(page.getByTestId('area-chip-gulshan')).toHaveAttribute('aria-pressed', 'true')
  10 | 
  11 |     // Add beef tehari to cart
  12 |     await page.getByTestId('add-to-cart-beef-tehari').click()
  13 | 
  14 |     // Add chicken biryani to cart
  15 |     await page.getByTestId('add-to-cart-chicken-biryani').click()
  16 | 
  17 |     // Open cart drawer
  18 |     await page.getByTestId('open-cart-drawer').click()
  19 |     await expect(page.getByTestId('cart-drawer')).toBeVisible()
  20 | 
  21 |     // Verify 2 items
  22 |     await expect(page.getByTestId('cart-item-beef-tehari')).toBeVisible()
  23 |     await expect(page.getByTestId('cart-item-chicken-biryani')).toBeVisible()
  24 | 
  25 |     // Proceed to checkout
  26 |     await page.getByTestId('proceed-checkout-btn').click()
  27 |     await page.waitForURL('/checkout')
  28 | 
  29 |     // Step 1 — confirm cart, click Next
  30 |     await page.getByTestId('step1-next').click()
  31 | 
  32 |     // Step 2 — fill delivery details
  33 |     await page.getByTestId('input-name').fill('Test User')
  34 |     await page.getByTestId('input-phone').fill('01711-123456')
  35 |     await page.getByTestId('input-area').selectOption('gulshan')
  36 |     await page.getByTestId('input-address').fill('House 5, Road 3, Gulshan-1')
  37 |     await page.getByTestId('step2-next').click()
  38 | 
  39 |     // Step 3 — place order
  40 |     await expect(page.getByTestId('place-order-btn')).toBeVisible()
  41 |     await page.getByTestId('place-order-btn').click()
  42 | 
  43 |     // Confirmation page
  44 |     await page.waitForURL('/confirmation')
> 45 |     await expect(page.getByTestId('order-number')).toBeVisible()
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  46 |     await expect(page.getByTestId('order-number')).toContainText('BC-')
  47 |   })
  48 | })
  49 | 
```