import { supabase } from '@/lib/supabase'
import type { DBProduct } from '@/lib/supabase'
import MenuManager from '@/components/admin/MenuManager'
export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const { data } = await supabase.from('products').select('*').order('sort_order')
  const products: DBProduct[] = data ?? []

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Menu</h1>
        <p className="text-brand-cream/40 text-sm mt-0.5">{products.length} items · {products.filter(p => p.is_available).length} available</p>
      </div>

      <MenuManager products={products} />
    </div>
  )
}
