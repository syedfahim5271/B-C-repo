import CheckoutForm from '@/components/CheckoutForm'
import { supabase } from '@/lib/supabase'
import { AREAS as staticAreas } from '@/data/products'
import type { DBArea } from '@/lib/supabase'

export const metadata = {
  title: 'Checkout — Biryani & Chill',
}

export const revalidate = 60 // ISR — keep active areas fresh

async function getAreas(): Promise<DBArea[]> {
  try {
    const { data } = await supabase.from('areas').select('*').eq('is_active', true).order('sort_order')
    return (data as DBArea[]) ?? staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 }))
  } catch {
    return staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 }))
  }
}

export default async function CheckoutPage() {
  const areas = await getAreas()
  return <CheckoutForm areas={areas} />
}
