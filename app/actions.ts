'use server'

import { supabase } from '@/lib/supabase'
import type { CartItem } from '@/store/cartStore'
import { getSession } from '@/lib/session'
import { updateUserProfile, generateRewardCode, hasRedeemedReferral } from '@/lib/users'
import { REFERRAL_DISCOUNT_PCT, type PromoKind, type PromoResult } from '@/lib/promo'
import { STORE_CLOSED, CLOSED_MESSAGE } from '@/lib/storeStatus'

export interface OrderPayload {
  orderNumber: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  promoKind?: PromoKind
  referrerId?: string
  delivery: { name: string; phone: string; area: string; address: string; note?: string }
}

export async function saveOrder(payload: OrderPayload): Promise<{ success: boolean; error?: string }> {
  // Hard kill switch — while the store is temporarily closed, reject every order
  // no matter what the client sends. This is the authoritative block.
  if (STORE_CLOSED) {
    return { success: false, error: CLOSED_MESSAGE }
  }
  try {
    // Bind the order to the signed-in user, if any (never trust a client id).
    const session = await getSession()
    const userId = session?.user?.id ?? null

    // Re-check the per-customer promo limit server-side. validatePromoCode
    // already checked it, but a stale tab could replay a code the customer
    // has since used up, so the authoritative check happens here.
    if (payload.promoCode && (payload.promoKind ?? 'promo') === 'promo') {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('per_user_limit')
        .eq('code', payload.promoCode)
        .maybeSingle()
      const limitError = await perUserLimitError(promo?.per_user_limit ?? null, payload.promoCode, userId)
      if (limitError) return { success: false, error: limitError }
    }

    const { error } = await supabase.from('orders').insert({
      order_number:    payload.orderNumber,
      items:           payload.items,
      subtotal:        payload.subtotal,
      discount:        payload.discount,
      delivery_charge: 30,
      total:           payload.total,
      promo_code:      payload.promoCode ?? null,
      delivery:        payload.delivery,
      status:          'pending',
      user_id:         userId,
    })

    if (error) {
      console.error('[saveOrder] Supabase error:', error.message, error.details)
      return { success: false, error: error.message }
    }

    // Apply the side effects of whichever kind of code was used (best effort).
    if (payload.promoCode) {
      await applyPromoSideEffects(payload, userId).catch(e =>
        console.error('[saveOrder] promo side-effect failed:', e),
      )
    }

    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[saveOrder] Exception:', msg)
    return { success: false, error: msg }
  }
}

/** How many times this customer has already redeemed a given promo code. */
async function promoUsesByUser(code: string, userId: string): Promise<number> {
  const { count } = await supabase
    .from('promo_redemptions')
    .select('id', { count: 'exact', head: true })
    .eq('code', code)
    .eq('user_id', userId)
  return count ?? 0
}

/**
 * Per-customer usage guard for a marketing promo code. `limit` is the code's
 * `per_user_limit` (null = unlimited). Returns the message to show the
 * customer when they may not use it again, or null when they still may.
 */
async function perUserLimitError(limit: number | null, code: string, userId: string | null): Promise<string | null> {
  if (!limit) return null
  // A limit is only enforceable against an account, so a limited code
  // requires signing in (checkout already does).
  if (!userId) return 'Sign in to use this code.'
  const used = await promoUsesByUser(code, userId)
  if (used < limit) return null
  return limit === 1
    ? "You've already used this code."
    : `You can only use this code ${limit} times.`
}

/**
 * After an order is saved, record what the promo/referral/reward code did:
 *  - promo    → bump usage_count
 *  - referral → mint a one-time 15% reward code for the referrer (also records
 *               that this user redeemed a referral, enforcing once-per-user)
 *  - reward   → mark the reward code as used so it can't be reused
 */
async function applyPromoSideEffects(payload: OrderPayload, userId: string | null) {
  const code = payload.promoCode!
  const kind = payload.promoKind ?? 'promo'

  if (kind === 'promo') {
    const { data: promo } = await supabase.from('promo_codes').select('usage_count').eq('code', code).single()
    if (promo) {
      await supabase.from('promo_codes').update({ usage_count: promo.usage_count + 1 }).eq('code', code)
    }
    // Record the redemption — counting these rows is what enforces per_user_limit.
    await supabase.from('promo_redemptions').insert({
      code,
      user_id: userId,
      order_number: payload.orderNumber,
    })
    return
  }

  if (kind === 'reward') {
    await supabase
      .from('rewards')
      .update({ is_used: true, used_at: new Date().toISOString(), used_order: payload.orderNumber })
      .eq('code', code)
      .eq('is_used', false)
    return
  }

  if (kind === 'referral' && payload.referrerId && userId && payload.referrerId !== userId) {
    // Guard against double-redemption (unique(referred_user_id) also enforces this).
    if (await hasRedeemedReferral(userId)) return
    const rewardCode = await generateRewardCode()
    await supabase.from('rewards').insert({
      code: rewardCode,
      referrer_id: payload.referrerId,
      referred_user_id: userId,
      source_order: payload.orderNumber,
      is_used: false,
    })
  }
}

/** Active delivery areas, for client components that can't fetch server-side directly. */
export async function getActiveAreas() {
  try {
    const { data } = await supabase.from('areas').select('*').eq('is_active', true).order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

export interface ProfileInput {
  name?: string
  phone?: string
  area?: string
  address?: string
}

/** Update the signed-in user's profile. Session-guarded — ignores any client-supplied id. */
export async function updateProfile(patch: ProfileInput): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  const userId = session?.user?.id
  if (!userId) return { success: false, error: 'Not signed in' }
  try {
    await updateUserProfile(userId, {
      name: patch.name?.trim(),
      phone: patch.phone?.trim(),
      area: patch.area?.trim(),
      address: patch.address?.trim(),
    })
    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[updateProfile] error:', msg)
    return { success: false, error: msg }
  }
}

/**
 * Validate a code entered in the checkout promo field. It can be one of:
 *  1. a marketing promo code (`promo_codes`)
 *  2. a one-time referral reward code, GIFT-XXXX (`rewards`)
 *  3. another user's referral code (`users.referral_code`) → 15% for the buyer
 * The signed-in user's id is read from the session (referral self-use / once-per-user checks).
 */
export async function validatePromoCode(raw: string): Promise<PromoResult> {
  const code = raw.toUpperCase().trim()
  if (!code) return { kind: 'invalid', reason: 'Enter a code' }

  const session = await getSession()
  const userId = session?.user?.id

  // 1. Marketing promo code
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('code, type, discount, label, per_user_limit')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle()
  if (promo) {
    const limitError = await perUserLimitError(promo.per_user_limit, promo.code, userId ?? null)
    if (limitError) return { kind: 'invalid', reason: limitError }
    return { kind: 'promo', code: promo.code, type: promo.type, discount: promo.discount, label: promo.label }
  }

  // 2. One-time referral reward code (GIFT-XXXX)
  const { data: reward } = await supabase
    .from('rewards')
    .select('code, referrer_id, is_used')
    .eq('code', code)
    .maybeSingle()
  if (reward) {
    if (reward.is_used) return { kind: 'invalid', reason: 'This reward code has already been used.' }
    if (userId && reward.referrer_id !== userId) return { kind: 'invalid', reason: 'This reward code belongs to another account.' }
    return { kind: 'reward', code, type: 'percent', discount: REFERRAL_DISCOUNT_PCT, label: `${REFERRAL_DISCOUNT_PCT}% reward — one-time` }
  }

  // 3. Someone's referral code
  const { data: referrer } = await supabase
    .from('users')
    .select('id, referral_code')
    .eq('referral_code', code)
    .maybeSingle()
  if (referrer) {
    if (!userId) return { kind: 'invalid', reason: 'Sign in to use a referral code.' }
    if (referrer.id === userId) return { kind: 'invalid', reason: "You can't use your own referral code." }
    if (await hasRedeemedReferral(userId)) return { kind: 'invalid', reason: "You've already used a referral code." }
    return { kind: 'referral', code, type: 'percent', discount: REFERRAL_DISCOUNT_PCT, label: `${REFERRAL_DISCOUNT_PCT}% off via referral`, referrerId: referrer.id }
  }

  return { kind: 'invalid', reason: 'Invalid code. Check and try again.' }
}
