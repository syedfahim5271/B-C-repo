import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { OAuth2Client } from 'google-auth-library'
import { upsertGoogleUser, getUserById, isProfileComplete } from './users'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

/**
 * Auth is Google One Tap: the browser (Google Identity Services) produces an ID
 * token, which we verify here and exchange for a NextAuth session. No redirect.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      id: 'google-onetap',
      name: 'Google One Tap',
      credentials: { credential: { label: 'Google ID Token', type: 'text' } },
      async authorize(credentials) {
        const credential = credentials?.credential
        if (!credential || !GOOGLE_CLIENT_ID) return null

        const client = new OAuth2Client(GOOGLE_CLIENT_ID)
        const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
        const payload = ticket.getPayload()
        if (!payload?.sub) return null

        const { user } = await upsertGoogleUser({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
        })

        // The object returned here seeds the JWT (see callbacks.jwt).
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? payload.name ?? undefined,
          image: payload.picture,
          referralCode: user.referral_code,
          profileComplete: isProfileComplete(user),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign-in: copy our fields onto the token.
      if (user) {
        token.userId = (user as { id: string }).id
        token.referralCode = (user as { referralCode?: string }).referralCode
        token.profileComplete = (user as { profileComplete?: boolean }).profileComplete ?? false
        token.picture = (user as { image?: string }).image ?? token.picture
      }
      // Profile edits call session.update() -> re-read the latest from Supabase.
      if (trigger === 'update' && token.userId) {
        const fresh = await getUserById(token.userId as string)
        if (fresh) {
          token.name = fresh.name ?? token.name
          token.referralCode = fresh.referral_code
          token.profileComplete = isProfileComplete(fresh)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.referralCode = token.referralCode as string | undefined
        session.user.profileComplete = (token.profileComplete as boolean) ?? false
        session.user.image = (token.picture as string | undefined) ?? session.user.image
      }
      return session
    },
  },
}
