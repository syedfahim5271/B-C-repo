import { supabase } from '@/lib/supabase'
import type { DBProduct } from '@/lib/supabase'
import { upsertProduct, deleteProduct, toggleProductAvailability } from '../actions'
export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const { data } = await supabase.from('products').select('*').order('sort_order')
  const products: DBProduct[] = data ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Menu</h1>
        <p className="text-brand-cream/40 text-sm mt-0.5">{products.length} items · {products.filter(p => p.is_available).length} available</p>
      </div>

      {/* Existing items */}
      <div className="space-y-3">
        {products.map(p => (
          <div
            key={p.id}
            className={`rounded-2xl p-4 border flex items-center gap-4 transition-all ${
              p.is_available ? 'bg-white/5 border-white/8' : 'bg-white/2 border-white/5 opacity-60'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-brand-cream">{p.name}</p>
                {p.badge && (
                  <span className="text-xs bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full">{p.badge}</span>
                )}
                {!p.is_available && (
                  <span className="text-xs bg-white/10 text-brand-cream/40 px-2 py-0.5 rounded-full">Sold Out</span>
                )}
              </div>
              <p className="text-brand-cream/50 text-sm mt-0.5">{p.description}</p>
              <p className="text-brand-yellow font-bold mt-1">৳{p.price}</p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Toggle switch */}
              <form action={toggleProductAvailability.bind(null, p.id, !p.is_available)}>
                <button
                  type="submit"
                  title={p.is_available ? 'Mark as sold out' : 'Mark as available'}
                  className="group flex items-center gap-2"
                >
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${p.is_available ? 'bg-green-500' : 'bg-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                  <span className={`text-xs font-medium ${p.is_available ? 'text-green-400' : 'text-brand-cream/40'}`}>
                    {p.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </button>
              </form>

              {/* Delete */}
              <form action={deleteProduct.bind(null, p.id)}>
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/30 hover:bg-brand-red/20 hover:text-brand-red transition-colors font-medium"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Add new item form */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-4">Add New Item</h2>
        <form action={upsertProduct} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Dish Name *</label>
            <input name="name" placeholder="e.g. Mutton Biryani" required className="input-field" />
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Price (৳) *</label>
            <input name="price" type="number" placeholder="e.g. 220" required className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Description *</label>
            <input name="description" placeholder="e.g. Tender mutton with fragrant basmati rice" required className="input-field" />
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Image URL</label>
            <input name="image_url" placeholder="/food-hero.png (leave blank for default)" className="input-field" />
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Badge (optional)</label>
            <input name="badge" placeholder="e.g. 🔥 Popular" className="input-field" />
          </div>
          <input type="hidden" name="is_available" value="true" />
          <input type="hidden" name="sort_order" value="0" />
          <button
            type="submit"
            className="sm:col-span-2 bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold transition-colors"
          >
            Add to Menu
          </button>
        </form>
      </div>

      <style>{`.input-field{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:.75rem;padding:.75rem 1rem;color:#FFF8E7;width:100%;outline:none;font-size:.875rem}.input-field::placeholder{color:rgba(255,248,231,0.3)}.input-field:focus{border-color:rgba(255,184,0,0.6)}`}</style>
    </div>
  )
}
