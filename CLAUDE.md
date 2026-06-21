# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project location

The Next.js app lives in the **`biryani-and-chill/` subdirectory**, not the repo root (`B&C website/`). Run all commands from inside `biryani-and-chill/`. The repo root only holds source images and `skills-lock.json`.

## Commands

```bash
npm run dev          # start dev server on localhost:3000
npm run build        # production build (next build runs ESLint + TS type check)
npm run lint         # ESLint
npx tsc --noEmit     # type check without building

npm run test                          # Jest unit tests
npm run test -- --testPathPattern=cartStore  # run a single unit test file

npm run test:e2e                      # Playwright E2E (auto-starts dev server via webServer)
npm run test:e2e:ui                   # Playwright with interactive UI
npx playwright test tests/e2e/order-flow.spec.ts  # single E2E file
npx playwright test --project="Mobile Chrome"     # single browser project
```

## Environment variables

Required (in `.env.local` locally, and in the host's env in production). `.env*.local` is gitignored — never commit it.

- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase project + **service-role** key (server-only; see below).
- `ADMIN_PASSWORD` — plaintext password checked at admin login.
- `ADMIN_SECRET` — HMAC signing secret for the admin session cookie. **Must be identical** across the app and middleware; changing it invalidates all admin sessions.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth client for the customer Google One Tap login (NextAuth Credentials provider verifies the Google ID token server-side).
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — same Client ID, exposed to the browser for the Google Identity Services (One Tap) script.
- `NEXTAUTH_SECRET` — signing secret for the NextAuth JWT session (`openssl rand -base64 32`). `NEXTAUTH_URL` — full site URL. See `GOOGLE_OAUTH_SETUP.md` for the full walkthrough; run `supabase/auth-schema.sql` to create the `users`/`rewards` tables.

## Architecture

This is a Next.js 14 App Router food-ordering site with a Supabase backend and a password-gated admin panel. There are two surfaces: the **public storefront** (`/`, `/checkout`, `/confirmation`, `/orders`) and the **admin panel** (`/admin/*`).

**Supabase access (`lib/supabase.ts`):** A single client is created with the **service-role key**, so it bypasses RLS and must only ever be imported into server code (server components, server actions, route handlers, middleware). It is exposed via a lazy `Proxy` so the module can be imported without env vars present (the error only throws on first actual use). Never import `lib/supabase.ts` into a `'use client'` component. Tables: `products`, `areas`, `orders`, `banner` (single row, id=1), `promo_codes` — schema and seed data in `supabase/schema.sql`. DB row types (`DBProduct`, `DBOrder`, etc.) are defined alongside the client in `lib/supabase.ts`.

**Static fallback:** `data/products.ts` holds hardcoded `products`, `AREAS`, and `PROMO_CODES` plus the contact constants `PHONE_NUMBER`, `WHATSAPP_NUMBER`, `WHATSAPP_URL`. The home page falls back to these (mapped into DB-shaped objects) if Supabase is unreachable, so the storefront still renders without a database. Note `WHATSAPP_NUMBER` must be in international format (e.g. `8801810098964`) for `wa.me` links; `PHONE_NUMBER` is the local dial string for `tel:`.

**Data fetching / rendering:** The home page (`app/page.tsx`) is a server component that fetches available products, active areas, and the banner in parallel, with `export const revalidate = 60` (ISR). Admin pages use `export const dynamic = 'force-dynamic'` for always-fresh reads. After any admin mutation, server actions call `revalidatePath('/')` (and the relevant admin path) to push changes to the storefront.

**Mutations are server actions, split by trust boundary:**
- `app/actions.ts` — **public** actions callable from the storefront: `saveOrder` (inserts the order, best-effort increments promo `usage_count`) and `validatePromoCode`.
- `app/admin/actions.ts` — **admin** actions: auth (`loginAction`/`logoutAction`), `getOrdersCount`, `updateOrderStatus`, and CRUD/toggles for products, areas, banner, and promos.

**Admin auth:** `middleware.ts` matches `/admin/:path*`, lets `/admin/login` through, and otherwise requires a valid `bc-admin` cookie — an HMAC-SHA256 of the cookie name keyed by `ADMIN_SECRET` (Web Crypto, Edge-compatible). The same HMAC logic is duplicated in `lib/auth.ts` for issuing/verifying the token (middleware cannot import server-action modules). Login is handled by the route handler `app/api/admin/login/route.ts` (form POST → sets cookie → 303 redirect); `loginAction` in `app/admin/actions.ts` is an equivalent server-action path. The admin layout (`app/admin/layout.tsx`) reads the cookie server-side to decide whether to render the sidebar chrome.

**Order lifecycle (three persistence layers):** On checkout submit, `CheckoutForm.tsx` (1) calls `saveOrder` to persist to Supabase, (2) appends to the client-only `orderStore` (Zustand, persisted to `localStorage` key `bc-orders`) which backs the customer-facing `/orders` "My Orders" page and the Header badge, and (3) writes the order to `sessionStorage` under `bc-order` and navigates to `/confirmation`. The confirmation page reads and immediately deletes the `bc-order` session entry; if missing, it redirects to `/`. Order numbers are generated client-side as `BC-YYYYMMDD-NNN`. Admins see/manage orders at `/admin/orders`.

**Admin new-order sound:** `components/admin/OrderNotifier.tsx` (rendered once in the admin layout) polls `getOrdersCount` every 8s; when the count rises it plays a Web-Audio chime and calls `router.refresh()`. Browsers block audio until a user gesture, so it shows a one-time "Enable order sound" button that unlocks the `AudioContext`.

**Cart state (`store/cartStore.ts`):** Zustand + `persist`, stored in `localStorage` under `bc-cart` — only `items` and `selectedArea` are serialized (not `isDrawerOpen`). Any component reading cart data must be a client component.

**Checkout flow:** `CheckoutForm.tsx` is one client component with 3 internal steps via local `useState`. All three steps share a single React Hook Form instance so values persist across steps; calling `handleSubmit(() => goNext())()` triggers field validation without final submission.

**Server vs client components:** Layouts and the page shells (`app/page.tsx`, `app/checkout/page.tsx`) are server components. Push `'use client'` down as far as possible — anything reading `useCartStore`/`useOrderStore` or using Framer Motion must be a client component.

## Brand & Styling

Brand colors live in `tailwind.config.ts` under `theme.extend.colors.brand`:
- `brand-yellow` `#FFB800` — primary CTA color
- `brand-red` `#E8231A` — badges, destructive actions
- `brand-dark` / `brand-darker` — backgrounds
- `brand-cream` `#FFF8E7` — body text

Display headings use `font-display` (Sora), body copy uses `font-body` (Plus Jakarta Sans), both loaded via `next/font/google` in `layout.tsx`.

All tap targets must be ≥ 44×44px — use the `min-tap` utility class (`min-height: 44px; min-width: 44px`) defined in `globals.css`.

## Testing Conventions

**Unit tests** (`tests/unit/`) use Jest + `@testing-library/react`. Reset Zustand state with `useCartStore.setState(...)` in `beforeEach` — do not rely on module-level isolation.

**E2E tests** (`tests/e2e/`) use `data-testid` attributes for all selectors; never select by text or CSS class. The Playwright config runs three browser projects (Pixel 7, iPhone 14, Desktop Chrome) and auto-starts the dev server. Test IDs follow the pattern `area-chip-{id}`, `product-card-{id}`, `add-to-cart-{id}`, `cart-item-{id}`, `drawer-increase-{id}`, `drawer-decrease-{id}`.

## Lucide React note

`lucide-react` does not export `Facebook` or `Instagram` icons. Social icons in `Footer.tsx` are inline SVGs. Check available exports before adding new Lucide icons — `node -e "const l = require('lucide-react'); console.log(Object.keys(l))"`.
