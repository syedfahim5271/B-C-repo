import { getSession } from '@/lib/session'
import { getUserById, getUserRewards } from '@/lib/users'
import { getActiveAreas } from '@/app/actions'
import type { DBArea } from '@/lib/supabase'
import SignInPrompt from '@/components/auth/SignInPrompt'
import ProfileClient from '@/components/profile/ProfileClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Profile — Biryani & Chill',
}

export default async function ProfilePage() {
  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <SignInPrompt
        emoji="👤"
        title="Your profile"
        subtitle="Sign in with Google to see your details, referral code, and rewards."
      />
    )
  }

  const [user, rewards, areas] = await Promise.all([
    getUserById(userId),
    getUserRewards(userId),
    getActiveAreas(),
  ])

  if (!user) {
    return (
      <SignInPrompt
        emoji="👤"
        title="Your profile"
        subtitle="We couldn't load your account. Try signing in again."
      />
    )
  }

  return <ProfileClient user={user} rewards={rewards} areas={areas as DBArea[]} />
}
