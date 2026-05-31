# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> TC-002: Area Selector >> selected area pre-fills checkout form
- Location: tests/e2e/checkout.spec.ts:26:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "banani"
Received: ""
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Biryani & Chill home" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Biryani & Chill" [ref=e5]
      - link "Biryani & Chill" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]:
        - link "My Orders" [ref=e8] [cursor=pointer]:
          - /url: /orders
          - img [ref=e9]
          - generic [ref=e13]: My Orders
        - link "Call us" [ref=e14] [cursor=pointer]:
          - /url: tel:+88001686600954
          - img [ref=e15]
        - link "Order on WhatsApp" [ref=e17] [cursor=pointer]:
          - /url: https://wa.me/88001686600954?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A
          - img [ref=e18]
          - generic [ref=e20]: Order on WhatsApp
  - main [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - generic [ref=e25]: "1"
        - generic [ref=e28]: "2"
        - generic [ref=e31]: "3"
        - paragraph [ref=e32]: Delivery Details
      - generic [ref=e33]:
        - heading "Delivery Details" [level=1] [ref=e34]
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Your Name *
            - textbox "e.g. Rahim Uddin" [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: Phone Number *
            - textbox "e.g. 01711-123456" [ref=e41]
          - generic [ref=e42]:
            - generic [ref=e43]: Delivery Area *
            - combobox [ref=e44]:
              - option "Select area" [disabled] [selected]
              - option "📍 Bashundhara"
              - option "🏙️ Uttara"
              - option "✨ Gulshan"
              - option "🌿 Banani"
              - option "🎨 Dhanmondi"
              - option "🏘️ Mirpur"
              - option "🌆 Mohakhali"
              - option "🕌 Mohammadpur"
          - generic [ref=e45]:
            - generic [ref=e46]: Delivery Address *
            - textbox "House, Road, Block — be specific so we find you fast" [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]: Order Note (optional)
            - textbox "e.g. Less spicy please, extra raita" [ref=e50]
        - generic [ref=e51]:
          - button "Back" [ref=e52] [cursor=pointer]:
            - img [ref=e53]
            - text: Back
          - button "Review Order" [ref=e55] [cursor=pointer]:
            - text: Review Order
            - img [ref=e56]
  - contentinfo [ref=e58]:
    - generic [ref=e59]:
      - generic [ref=e60]:
        - generic [ref=e61]:
          - paragraph [ref=e62]: Biryani & Chill
          - paragraph [ref=e63]: Hot. Hygienic. Heart-stealing.
        - generic [ref=e64]:
          - paragraph [ref=e65]: Follow Us
          - generic [ref=e66]:
            - link "Facebook" [ref=e67] [cursor=pointer]:
              - /url: https://www.facebook.com/biryaniandchill/
              - img [ref=e68]
            - link "Instagram" [ref=e70] [cursor=pointer]:
              - /url: https://www.instagram.com/biryaniandchill.bd/
              - img [ref=e71]
            - link "Call us" [ref=e75] [cursor=pointer]:
              - /url: tel:+88001686600954
              - img [ref=e76]
            - link "WhatsApp" [ref=e78] [cursor=pointer]:
              - /url: https://wa.me/88001686600954?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A
              - img [ref=e79]
      - generic [ref=e81]: © 2026 Biryani & Chill. All rights reserved.
  - alert [ref=e82]
  - generic [ref=e84]:
    - button "Open cart" [ref=e85] [cursor=pointer]:
      - img [ref=e86]
      - generic [ref=e90]: "1"
    - button "View cart" [ref=e91] [cursor=pointer]:
      - paragraph [ref=e92]: ৳190
      - paragraph [ref=e93]: 1 item
    - button "Go to checkout" [ref=e94] [cursor=pointer]:
      - text: Checkout
      - img [ref=e95]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('TC-005: Checkout Validation', () => {
  4  |   test('shows errors when submitting empty form', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await page.getByTestId('add-to-cart-beef-tehari').click()
  7  |     await page.goto('/checkout')
  8  | 
  9  |     // Skip step 1
  10 |     await page.getByTestId('step1-next').click()
  11 | 
  12 |     // Try to proceed without filling form
  13 |     await page.getByTestId('step2-next').click()
  14 | 
  15 |     // Error messages should appear
  16 |     await expect(page.getByTestId('error-name')).toBeVisible()
  17 |     await expect(page.getByTestId('error-phone')).toBeVisible()
  18 |     await expect(page.getByTestId('error-address')).toBeVisible()
  19 | 
  20 |     // Should NOT navigate away
  21 |     await expect(page).toHaveURL('/checkout')
  22 |   })
  23 | })
  24 | 
  25 | test.describe('TC-002: Area Selector', () => {
  26 |   test('selected area pre-fills checkout form', async ({ page }) => {
  27 |     await page.goto('/')
  28 |     await page.getByTestId('area-chip-banani').click()
  29 |     await expect(page.getByTestId('area-chip-banani')).toHaveAttribute('aria-pressed', 'true')
  30 | 
  31 |     await page.getByTestId('add-to-cart-beef-tehari').click()
  32 |     await page.goto('/checkout')
  33 |     await page.getByTestId('step1-next').click()
  34 | 
  35 |     const areaValue = await page.getByTestId('input-area').inputValue()
> 36 |     expect(areaValue).toBe('banani')
     |                       ^ Error: expect(received).toBe(expected) // Object.is equality
  37 |   })
  38 | })
  39 | 
```