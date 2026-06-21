import 'server-only'
import { supabase } from './supabase'
import type { DBUser, DBReward } from './supabase'

/** A user profile is "complete" once we have the fields checkout needs. */
export function isProfileComplete(u: Pick<DBUser, 'name' | 'phone' | 'area' | 'address'> | null): boolean {
  return !!(u && u.name && u.phone && u.area && u.address)
}

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')
}

const BASE32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
function randomBase32(n: number): string {
  return Array.from({ length: n }, () => BASE32[Math.floor(Math.random() * BASE32.length)]).join('')
}

/** e.g. "Karim Uddin" -> "KARIM82", guaranteed unique in users.referral_code. */
export async function generateReferralCode(name: string | null | undefined): Promise<string> {
  const prefix =
    (name ?? '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 5) || 'BC'
  for (let i = 0; i < 12; i++) {
    const code = `${prefix}${randomDigits(2)}`
    const { data } = await supabase.from('users').select('id').eq('referral_code', code).maybeSingle()
    if (!data) return code
  }
  // Fallback: longer random suffix is practically collision-free
  return `${prefix}${randomBase32(6)}`
}

/** e.g. "GIFT-X7K2", guaranteed unique in rewards.code. */
export async function generateRewardCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = `GIFT-${randomBase32(4)}`
    const { data } = await supabase.from('rewards').select('id').eq('code', code).maybeSingle()
    if (!data) return code
  }
  return `GIFT-${randomBase32(8)}`
}

interface GoogleProfile {
  googleId: string
  email?: string | null
  name?: string | null
}

/** Find the user by google_id, or create a new one with a fresh referral code. */
export async function upsertGoogleUser(p: GoogleProfile): Promise<{ user: DBUser; isNew: boolean }> {
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', p.googleId)
    .maybeSingle()

  if (existing) {
    // Keep email/name fresh from Google without clobbering profile edits.
    const patch: Partial<DBUser> = {}
    if (p.email && p.email !== existing.email) patch.email = p.email
    if (!existing.name && p.name) patch.name = p.name
    if (Object.keys(patch).length) {
      const { data: updated } = await supabase
        .from('users')
        .update(patch)
        .eq('id', existing.id)
        .select('*')
        .single()
      return { user: (updated as DBUser) ?? (existing as DBUser), isNew: false }
    }
    return { user: existing as DBUser, isNew: false }
  }

  const referral_code = await generateReferralCode(p.name)
  const { data: created, error } = await supabase
    .from('users')
    .insert({ google_id: p.googleId, email: p.email ?? null, name: p.name ?? null, referral_code })
    .select('*')
    .single()
  if (error) throw new Error(`Failed to create user: ${error.message}`)
  return { user: created as DBUser, isNew: true }
}

export async function getUserById(id: string): Promise<DBUser | null> {
  const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
  return (data as DBUser) ?? null
}

export async function updateUserProfile(
  id: string,
  patch: { name?: string; phone?: string; area?: string; address?: string },
): Promise<DBUser | null> {
  const { data, error } = await supabase
    .from('users')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return (data as DBUser) ?? null
}

export async function getUserRewards(referrerId: string): Promise<DBReward[]> {
  const { data } = await supabase
    .from('rewards')
    .select('*')
    .eq('referrer_id', referrerId)
    .order('created_at', { ascending: false })
  return (data as DBReward[]) ?? []
}

/** Has this user already redeemed a referral code (enforces once-per-user)? */
export async function hasRedeemedReferral(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('rewards')
    .select('id')
    .eq('referred_user_id', userId)
    .maybeSingle()
  return !!data
}
