# Google One Tap / OAuth setup

The Google login (One Tap) needs a Google Cloud OAuth **Client ID**. Follow these steps once,
then paste the values into `.env.local`.

## 1. Create / pick a Google Cloud project
1. Go to <https://console.cloud.google.com/>.
2. Top bar → project picker → **New Project** (or pick an existing one). Name it e.g. `Biryani & Chill`.

## 2. Configure the OAuth consent screen
1. Left menu → **APIs & Services → OAuth consent screen**.
2. User type: **External** → Create.
3. Fill App name (`Biryani & Chill`), your support email, and a developer contact email. Save.
4. You can leave it in **Testing** mode while developing. Add your own Google account(s) under
   **Test users** so you can sign in. Publish to **Production** when you go live.

## 3. Create the OAuth Client ID
1. Left menu → **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
4. **Authorized JavaScript origins** — add every origin the site runs on:
   - `http://localhost:3000` (local dev)
   - your production URL, e.g. `https://biryaniandchill.com`
5. **Authorized redirect URIs** — add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-DOMAIN/api/auth/callback/google`
   (One Tap itself doesn't redirect, but NextAuth registers this callback — add it to be safe.)
6. **Create**. Copy the **Client ID** and **Client secret**.

## 4. Set environment variables
Add to `biryani-and-chill/.env.local` (and to your host's env in production):

```bash
# Google OAuth (One Tap)
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxx
# Same Client ID, exposed to the browser for the One Tap script:
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

# NextAuth
NEXTAUTH_URL=http://localhost:3000          # your full site URL in production
NEXTAUTH_SECRET=run: openssl rand -base64 32 # any long random string
```

Generate `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## 5. Run the DB migration
In the Supabase dashboard → SQL editor, run `supabase/auth-schema.sql` (after the base
`supabase/schema.sql`). This creates the `users` and `rewards` tables and adds `orders.user_id`.

## 6. Restart the dev server
`NEXT_PUBLIC_*` and other env vars are read at startup, so restart `npm run dev` after editing
`.env.local`.

## Notes
- One Tap in Chrome uses **FedCM**; the app enables it and also renders the standard Google
  Sign-In button as a reliable fallback, so login works even if the One Tap bubble is suppressed.
- Logins are blocked until the consent screen has your account as a Test user (or is Published).
