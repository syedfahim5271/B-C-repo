/**
 * Manual "temporarily closed" kill switch.
 *
 * While `STORE_CLOSED` is true, ordering is disabled everywhere: Add-to-cart and
 * the Checkout CTAs are turned off in the UI, and `saveOrder` refuses to insert
 * an order server-side (the authoritative block — the UI is just courtesy).
 *
 * To REOPEN: set `NEXT_PUBLIC_STORE_CLOSED=false` in the environment (Vercel →
 * Project → Settings → Environment Variables, then redeploy), or flip
 * `DEFAULT_CLOSED` below to `false` and redeploy. Either way, no other code
 * changes are needed.
 *
 * NEXT_PUBLIC_ is inlined at build time, so this constant is identical on the
 * server and in the browser — safe to read from both server and client code.
 */
const DEFAULT_CLOSED = false

export const STORE_CLOSED =
  process.env.NEXT_PUBLIC_STORE_CLOSED === 'true'
    ? true
    : process.env.NEXT_PUBLIC_STORE_CLOSED === 'false'
      ? false
      : DEFAULT_CLOSED

/** Full closure message shown in the site-wide banner. */
export const CLOSED_MESSAGE =
  "Biryani & Chill is temporarily closed for a few days. We'll be back soon with our delicious homemade Special Beef Tehari. Thank you for your patience! ❤️"

/** Short label for buttons/pills where the full message won't fit. */
export const CLOSED_LABEL = 'Temporarily closed'
