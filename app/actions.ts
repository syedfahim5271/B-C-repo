'use server'

import { supabase } from '@/lib/supabase'
import type { CartItem } from '@/store/cartStore'

export interface OrderPayload {
  orderNumber: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  delivery: { name: string; phone: string; area: string; address: string; note?: string }
}

export async function saveOrder(payload: OrderPayload) {
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
  })
  if (error) console.error('saveOrder error:', error.message)

  // Increment promo usage count
  if (payload.promoCode) {
    await supabase.rpc('increment_promo_usage', { promo_code: payload.promoCode }).maybeSingle()
  }
}

export async function validatePromoCode(code: string) {
  const { data } = await supabase
    .from('promo_codes')
    .select('code, type, discount, label, is_active')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()
  return data
}
