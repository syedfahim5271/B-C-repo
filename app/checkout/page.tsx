import CheckoutForm from '@/components/CheckoutForm'
import { supabase } from '@/lib/supabase'
import { AREAS as staticAreas } from '@/data/products'
import type { DBArea } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { getUserById } from '@/lib/users'

export const metadata = {
  title: 'Checkout — Biryani & Chill',
}

// Per-user profile autofill means this must render dynamically.
export const dynamic = 'force-dynamic'

async function getAreas(): Promise<DBArea[]> {
  try {
    const { data } = await supabase.from('areas').select('*').eq('is_active', true).order('sort_order')
    return (data as DBArea[]) ?? staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 }))
  } catch {
    return staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 }))
  }
}

export default async function CheckoutPage() {
  const session = await getSession()
  const [areas, user] = await Promise.all([
    getAreas(),
    session?.user?.id ? getUserById(session.user.id) : Promise.resolve(null),
  ])
  return <CheckoutForm areas={areas} user={user} />
}
