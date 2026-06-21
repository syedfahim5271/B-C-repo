import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars not set. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_t, prop) => getClient()[prop as keyof SupabaseClient],
})

// ── Types ────────────────────────────────────────────────────

export interface DBProduct {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  badge: string | null
  is_available: boolean
  sort_order: number
}

export interface DBArea {
  id: string
  label: string
  emoji: string
  is_active: boolean
  sort_order: number
}

export interface DBOrder {
  id: string
  order_number: string
  items: { id: string; name: string; price: number; quantity: number }[]
  subtotal: number
  discount: number
  delivery_charge: number
  total: number
  promo_code: string | null
  delivery: { name: string; phone: string; area: string; address: string; note?: string }
  status: string
  placed_at: string
}

export interface DBBanner {
  id: number
  badge_text: string
  title: string
  subtitle: string
  promo_hint: string
  is_active: boolean
}

export interface DBPromo {
  id: string
  code: string
  type: 'percent' | 'flat'
  discount: number
  label: string
  is_active: boolean
  usage_count: number
  created_at: string
}

export interface DBUser {
  id: string
  google_id: string
  email: string | null
  name: string | null
  phone: string | null
  area: string | null
  address: string | null
  referral_code: string
  created_at: string
  updated_at: string
}

export interface DBReward {
  id: string
  code: string
  referrer_id: string
  referred_user_id: string | null
  source_order: string | null
  is_used: boolean
  used_at: string | null
  used_order: string | null
  created_at: string
}
