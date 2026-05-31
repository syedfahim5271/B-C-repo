# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order-flow.spec.ts >> TC-001: Full Happy Path Order >> user can complete a full order flow
- Location: tests/e2e/order-flow.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('add-to-cart-chicken-biryani')
    - locator resolved to <button data-testid="add-to-cart-chicken-biryani" aria-label="Add Chicken Biryani / Tehari to cart" class="↵                  min-tap flex items-center gap-1.5 bg-brand-yellow text-brand-dark↵                  font-bold text-sm px-4 py-2.5 rounded-full transition-all↵                  hover:bg-brand-gold active:scale-95↵                  ↵                ">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    9 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/" class="hidden sm:block font-display font-bold text-lg text-brand-yellow tracking-tight flex-1">Biryani & Chill</a> from <header data-testid="header" class="sticky top-0 z-50 bg-brand-darker/95 backdrop-blur-sm border-b border-white/5">…</header> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="bg-brand-yellow rounded-2xl shadow-2xl shadow-brand-yellow/20 flex items-center gap-3 px-4 py-3">…</div> from <div data-testid="cart-bar" class="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe pb-4 pointer-events-none">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <a href="/" class="hidden sm:block font-display font-bold text-lg text-brand-yellow tracking-tight flex-1">Biryani & Chill</a> from <header data-testid="header" class="sticky top-0 z-50 bg-brand-darker/95 backdrop-blur-sm border-b border-white/5">…</header> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

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
        - img "Biryani & Chill" [ref=e25]
        - generic [ref=e27]:
          - generic [ref=e28]: 🔥 Limited Offer
          - heading "First order? 10% off" [level=2] [ref=e29]
          - paragraph [ref=e30]: Use code FIRSTORDER at checkout.
          - paragraph [ref=e31]: Also try CHILL20 for ৳20 off
      - region "Select delivery area" [ref=e32]:
        - paragraph [ref=e33]: Deliver to
        - generic [ref=e34]:
          - button "📍 Bashundhara" [ref=e35] [cursor=pointer]:
            - generic [ref=e36]: 📍
            - generic [ref=e37]: Bashundhara
          - button "🏙️ Uttara" [ref=e38] [cursor=pointer]:
            - generic [ref=e39]: 🏙️
            - generic [ref=e40]: Uttara
          - button "✨ Gulshan" [pressed] [ref=e41] [cursor=pointer]:
            - generic [ref=e42]: ✨
            - generic [ref=e43]: Gulshan
          - button "🌿 Banani" [ref=e44] [cursor=pointer]:
            - generic [ref=e45]: 🌿
            - generic [ref=e46]: Banani
          - button "🎨 Dhanmondi" [ref=e47] [cursor=pointer]:
            - generic [ref=e48]: 🎨
            - generic [ref=e49]: Dhanmondi
          - button "🏘️ Mirpur" [ref=e50] [cursor=pointer]:
            - generic [ref=e51]: 🏘️
            - generic [ref=e52]: Mirpur
          - button "🌆 Mohakhali" [ref=e53] [cursor=pointer]:
            - generic [ref=e54]: 🌆
            - generic [ref=e55]: Mohakhali
          - button "🕌 Mohammadpur" [ref=e56] [cursor=pointer]:
            - generic [ref=e57]: 🕌
            - generic [ref=e58]: Mohammadpur
      - generic [ref=e59]:
        - heading "Our Menu biryani" [level=2] [ref=e60]:
          - text: Our Menu
          - img "biryani" [ref=e61]
        - paragraph [ref=e62]: Dhaka's tastiest biryani, tehari & khichuri — delivered fast.
      - region "Menu" [ref=e63]:
        - generic [ref=e64]:
          - article [ref=e65]:
            - generic [ref=e66]:
              - img "Beef Tehari" [ref=e67]
              - generic [ref=e68]: 🔥 Popular
            - generic [ref=e69]:
              - generic [ref=e70]:
                - heading "Beef Tehari" [level=3] [ref=e71]
                - paragraph [ref=e72]: Slow-cooked beef in aromatic saffron rice
              - generic [ref=e73]:
                - generic [ref=e74]: ৳190
                - generic [ref=e75]:
                  - button "Decrease quantity" [ref=e76] [cursor=pointer]:
                    - img [ref=e77]
                  - generic [ref=e78]: "1"
                  - button "Increase quantity" [ref=e79] [cursor=pointer]:
                    - img [ref=e80]
          - article [ref=e81]:
            - generic [ref=e82]:
              - img "Chicken Biryani / Tehari" [ref=e83]
              - generic [ref=e84]: Bestseller
            - generic [ref=e85]:
              - generic [ref=e86]:
                - heading "Chicken Biryani / Tehari" [level=3] [ref=e87]
                - paragraph [ref=e88]: Tender chicken with fragrant basmati rice
              - generic [ref=e89]:
                - generic [ref=e90]: ৳170
                - button "Add Chicken Biryani / Tehari to cart" [ref=e91] [cursor=pointer]:
                  - img [ref=e92]
                  - text: Add
          - article [ref=e93]:
            - img "Chicken Khichuri" [ref=e95]
            - generic [ref=e96]:
              - generic [ref=e97]:
                - heading "Chicken Khichuri" [level=3] [ref=e98]
                - paragraph [ref=e99]: Comfort khichuri with juicy chicken pieces
              - generic [ref=e100]:
                - generic [ref=e101]: ৳170
                - button "Add Chicken Khichuri to cart" [ref=e102] [cursor=pointer]:
                  - img [ref=e103]
                  - text: Add
          - article [ref=e104]:
            - img "Beef Khichuri" [ref=e106]
            - generic [ref=e107]:
              - generic [ref=e108]:
                - heading "Beef Khichuri" [level=3] [ref=e109]
                - paragraph [ref=e110]: Rich beef khichuri, slow-cooked perfection
              - generic [ref=e111]:
                - generic [ref=e112]: ৳190
                - button "Add Beef Khichuri to cart" [ref=e113] [cursor=pointer]:
                  - img [ref=e114]
                  - text: Add
  - contentinfo [ref=e115]:
    - generic [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]: Biryani & Chill
          - paragraph [ref=e120]: Hot. Hygienic. Heart-stealing.
        - generic [ref=e121]:
          - paragraph [ref=e122]: Follow Us
          - generic [ref=e123]:
            - link "Facebook" [ref=e124] [cursor=pointer]:
              - /url: https://www.facebook.com/biryaniandchill/
              - img [ref=e125]
            - link "Instagram" [ref=e127] [cursor=pointer]:
              - /url: https://www.instagram.com/biryaniandchill.bd/
              - img [ref=e128]
            - link "Call us" [ref=e132] [cursor=pointer]:
              - /url: tel:+88001686600954
              - img [ref=e133]
            - link "WhatsApp" [ref=e135] [cursor=pointer]:
              - /url: https://wa.me/88001686600954?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A
              - img [ref=e136]
      - generic [ref=e138]: © 2026 Biryani & Chill. All rights reserved.
  - alert [ref=e139]
  - generic [ref=e141]:
    - button "Open cart" [ref=e142] [cursor=pointer]:
      - img [ref=e143]
      - generic [ref=e147]: "1"
    - button "View cart" [ref=e148] [cursor=pointer]:
      - paragraph [ref=e149]: ৳190
      - paragraph [ref=e150]: 1 item
    - button "Go to checkout" [ref=e151] [cursor=pointer]:
      - text: Checkout
      - img [ref=e152]
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
> 15 |     await page.getByTestId('add-to-cart-chicken-biryani').click()
     |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  45 |     await expect(page.getByTestId('order-number')).toBeVisible()
  46 |     await expect(page.getByTestId('order-number')).toContainText('BC-')
  47 |   })
  48 | })
  49 | 
```