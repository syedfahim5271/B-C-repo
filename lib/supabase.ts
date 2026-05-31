import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.SUPABASE_URL!
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
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
