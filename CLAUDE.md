# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server on localhost:3000
npm run build        # production build (also runs lint + type check)
npm run lint         # ESLint
npx tsc --noEmit     # type check without building

npm run test                          # Jest unit tests
npm run test -- --testPathPattern=cartStore  # run a single unit test file

npm run test:e2e                      # Playwright E2E (all browsers, auto-starts dev server)
npm run test:e2e:ui                   # Playwright with interactive UI
npx playwright test tests/e2e/order-flow.spec.ts  # single E2E file
npx playwright test --project="Mobile Chrome"     # single browser project
```

## Architecture

**Data flow:** All cart state lives in `store/cartStore.ts` (Zustand + `persist` middleware). The store is persisted to `localStorage` under the key `bc-cart` — only `items` and `selectedArea` are serialized (not drawer state). Any component that reads cart data must be a client component.

**Order handoff:** There is no backend. On checkout submission, `CheckoutForm.tsx` writes the completed order object to `sessionStorage` under `bc-order`, calls `clearCart()`, then navigates to `/confirmation`. The confirmation page reads and immediately deletes the session entry; if it's missing, it redirects to `/`. Order numbers are generated client-side as `BC-YYYYMMDD-NNN`.

**Checkout flow:** `CheckoutForm.tsx` is a single client component with 3 internal steps managed by local `useState`. React Hook Form handles step 2 validation; calling `handleSubmit(() => goNext())()` triggers field validation without final submission. All three steps share one `useForm` instance so values persist across steps.

**Server vs client components:** `app/layout.tsx`, `app/page.tsx`, and `app/checkout/page.tsx` are server components (thin shells). Every component that reads from `useCartStore` or uses Framer Motion must be a client component (`'use client'`). New components follow this pattern — keep server components as wrappers and push `'use client'` down as far as possible.

**Static content:** Menu items and delivery areas are defined in `data/products.ts`. To add a product, add an entry to the `products` array. To add a delivery area, add to `AREAS`. Both are imported by multiple components; the `id` field is used as the persistence key in cart and area selection state.

## Brand & Styling

Brand colors are in `tailwind.config.ts` under `theme.extend.colors.brand`:
- `brand-yellow` `#FFB800` — primary CTA color
- `brand-red` `#E8231A` — badges, destructive actions
- `brand-dark` / `brand-darker` — backgrounds
- `brand-cream` `#FFF8E7` — body text

Display headings use `font-display` (Sora), body copy uses `font-body` (Plus Jakarta Sans), both loaded via `next/font/google` in `layout.tsx`.

All tap targets must be ≥ 44×44px — use the `min-tap` utility class (`min-height: 44px; min-width: 44px`) defined in `globals.css`.

## Testing Conventions

**Unit tests** (`tests/unit/`) use Jest + `@testing-library/react`. Reset Zustand state with `useCartStore.setState(...)` in `beforeEach` — do not rely on module-level isolation.

**E2E tests** (`tests/e2e/`) use `data-testid` attributes for all selectors; never select by text or CSS class. The Playwright config runs three browser projects (Pixel 7, iPhone 14, Desktop Chrome). Test IDs follow the pattern `area-chip-{id}`, `product-card-{id}`, `add-to-cart-{id}`, `cart-item-{id}`, `drawer-increase-{id}`, `drawer-decrease-{id}`.

## Lucide React note

`lucide-react` does not export `Facebook` or `Instagram` icons. Social icons in `Footer.tsx` are inline SVGs. Check available exports before adding new Lucide icons — `node -e "const l = require('lucide-react'); console.log(Object.keys(l))"`.
