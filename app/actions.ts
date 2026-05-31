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

export async function saveOrder(payload: OrderPayload): Promise<{ success: boolean; error?: string }> {
  try {
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

    if (error) {
      console.error('[saveOrder] Supabase error:', error.message, error.details)
      return { success: false, error: error.message }
    }

    // Increment promo usage count (best effort)
    if (payload.promoCode) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('usage_count')
        .eq('code', payload.promoCode)
        .single()
      if (promo) {
        await supabase
          .from('promo_codes')
          .update({ usage_count: promo.usage_count + 1 })
          .eq('code', payload.promoCode)
      }
    }

    return { success: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[saveOrder] Exception:', msg)
    return { success: false, error: msg }
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
