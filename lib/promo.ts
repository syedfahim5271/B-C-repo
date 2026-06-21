// Shared promo/referral types and constants. Kept out of the 'use server'
// actions file, which may only export async functions.

export const REFERRAL_DISCOUNT_PCT = 25

export type PromoKind = 'promo' | 'referral' | 'reward'

export type PromoResult =
  | { kind: 'promo'; code: string; type: 'percent' | 'flat'; discount: number; label: string }
  | { kind: 'referral'; code: string; type: 'percent'; discount: number; label: string; referrerId: string }
  | { kind: 'reward'; code: string; type: 'percent'; discount: number; label: string }
  | { kind: 'invalid'; reason: string }
