import { supabase } from '@/lib/supabase'
import type { DBPromo } from '@/lib/supabase'
import { createPromo, togglePromo, deletePromo } from '../actions'

export default async function PromosPage() {
  const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false })
  const promos: DBPromo[] = data ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Promo Codes</h1>
        <p className="text-brand-cream/40 text-sm mt-0.5">{promos.filter(p => p.is_active).length} active codes</p>
      </div>

      {/* Create code */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-4">Create New Code</h2>
        <form action={createPromo} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Code *</label>
            <input name="code" placeholder="e.g. SUMMER30" required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream uppercase placeholder:text-brand-cream/30 placeholder:normal-case focus:outline-none focus:border-brand-yellow/60 transition-colors tracking-widest font-bold" />
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Label *</label>
            <input name="label" placeholder="e.g. 30% off summer special" required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Discount Type *</label>
            <select name="type" required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors text-sm appearance-none">
              <option value="percent" className="bg-brand-dark">Percent (%) off</option>
              <option value="flat"    className="bg-brand-dark">Flat (৳) off</option>
            </select>
          </div>
          <div>
            <label className="block text-brand-cream/60 text-xs font-medium mb-1.5 uppercase tracking-wider">Discount Amount *</label>
            <input name="discount" type="number" min="1" placeholder="e.g. 20" required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
          </div>
          <button type="submit"
            className="sm:col-span-2 bg-brand-yellow text-brand-dark font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors">
            Create Promo Code
          </button>
        </form>
      </div>

      {/* Codes list */}
      <div className="space-y-3">
        {promos.length === 0 && (
          <p className="text-brand-cream/30 text-center py-8">No promo codes yet</p>
        )}
        {promos.map(promo => (
          <div key={promo.id}
            className={`bg-white/5 rounded-2xl p-4 border transition-colors ${promo.is_active ? 'border-brand-yellow/20' : 'border-white/8 opacity-60'}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="font-display font-bold text-brand-yellow tracking-widest text-lg">{promo.code}</p>
                  <p className="text-brand-cream/50 text-sm">{promo.label}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="font-display font-bold text-brand-cream text-xl">
                    {promo.type === 'percent' ? `${promo.discount}%` : `৳${promo.discount}`}
                  </p>
                  <p className="text-brand-cream/30 text-xs">{promo.type === 'percent' ? 'percent off' : 'flat off'}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-brand-cream text-xl">{promo.usage_count}</p>
                  <p className="text-brand-cream/30 text-xs">times used</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={togglePromo.bind(null, promo.id, !promo.is_active)}>
                  <button type="submit"
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${promo.is_active ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-white/10 text-brand-cream/40 hover:bg-green-500/20 hover:text-green-400'}`}>
                    {promo.is_active ? 'Active' : 'Off'}
                  </button>
                </form>
                <form action={deletePromo.bind(null, promo.id)}>
                  <button type="submit"
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/40 hover:bg-brand-red/20 hover:text-brand-red transition-colors font-medium">
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <p className="text-brand-cream/20 text-xs mt-2">
              Created {new Date(promo.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
