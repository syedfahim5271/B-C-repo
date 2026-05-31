import { supabase } from '@/lib/supabase'
import type { DBProduct } from '@/lib/supabase'
import { upsertProduct, deleteProduct, toggleProductAvailability } from '../actions'

export default async function MenuPage() {
  const { data } = await supabase.from('products').select('*').order('sort_order')
  const products: DBProduct[] = data ?? []

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display font-bold text-2xl text-brand-cream">Menu</h1>

      {/* Add / Edit form */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-4">Add New Item</h2>
        <form action={upsertProduct} className="grid sm:grid-cols-2 gap-4">
          <input name="name" placeholder="Dish name *" required className="input-field" />
          <input name="price" type="number" placeholder="Price (৳) *" required className="input-field" />
          <input name="description" placeholder="Short description *" required className="input-field sm:col-span-2" />
          <input name="image_url" placeholder="Image URL (or leave blank for default)" className="input-field" />
          <input name="badge" placeholder="Badge (e.g. 🔥 Popular)" className="input-field" />
          <input name="sort_order" type="number" placeholder="Sort order (0, 1, 2…)" defaultValue="0" className="input-field" />
          <input type="hidden" name="is_available" value="true" />
          <button type="submit" className="sm:col-span-2 bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold transition-colors">
            Add Item
          </button>
        </form>
      </div>

      {/* Existing items */}
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white/5 rounded-2xl p-4 border border-white/8 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-brand-cream">{p.name}</p>
                {p.badge && <span className="text-xs bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full">{p.badge}</span>}
                {!p.is_available && <span className="text-xs bg-white/10 text-brand-cream/40 px-2 py-0.5 rounded-full">Unavailable</span>}
              </div>
              <p className="text-brand-cream/50 text-sm mt-0.5">{p.description}</p>
              <p className="text-brand-yellow font-bold text-sm mt-1">৳{p.price}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Toggle availability */}
              <form action={toggleProductAvailability.bind(null, p.id, !p.is_available)}>
                <button type="submit" className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${p.is_available ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400'}`}>
                  {p.is_available ? 'Available' : 'Sold Out'}
                </button>
              </form>

              {/* Delete */}
              <form action={deleteProduct.bind(null, p.id)}>
                <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/40 hover:bg-brand-red/20 hover:text-brand-red transition-colors font-medium">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <style>{`.input-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem 1rem; color: #FFF8E7; width: 100%; outline: none; font-size: 0.875rem; } .input-field::placeholder { color: rgba(255,248,231,0.3); } .input-field:focus { border-color: rgba(255,184,0,0.6); }`}</style>
    </div>
  )
}
