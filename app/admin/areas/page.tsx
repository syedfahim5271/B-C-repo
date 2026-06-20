import { supabase } from '@/lib/supabase'
import type { DBArea } from '@/lib/supabase'
import { upsertArea, deleteArea, toggleArea } from '../actions'
export const dynamic = 'force-dynamic'


export default async function AreasPage() {
  const { data } = await supabase.from('areas').select('*').order('sort_order')
  const areas: DBArea[] = data ?? []

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="font-display font-bold text-2xl text-brand-cream">Delivery Areas</h1>

      {/* Add area */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-4">Add New Area</h2>
        <form action={upsertArea} className="grid sm:grid-cols-3 gap-4">
          <input name="label" placeholder="Area name *" required className="input-field" />
          <input name="emoji" placeholder="Emoji (e.g. 📍)" defaultValue="📍" className="input-field" />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue="0" className="input-field" />
          <button type="submit" className="sm:col-span-3 bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold transition-colors">
            Add Area
          </button>
        </form>
      </div>

      {/* Existing areas */}
      <div className="grid sm:grid-cols-2 gap-3">
        {areas.map(area => (
          <div key={area.id} className="bg-white/5 rounded-xl p-4 border border-white/8 flex items-center gap-3">
            <span className="text-2xl">{area.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-brand-cream">{area.label}</p>
              <p className="text-brand-cream/30 text-xs">{area.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <form action={toggleArea.bind(null, area.id, !area.is_active)}>
                <button type="submit" className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${area.is_active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-brand-cream/40'}`}>
                  {area.is_active ? 'Active' : 'Off'}
                </button>
              </form>
              <form action={deleteArea.bind(null, area.id)}>
                <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-brand-cream/40 hover:bg-brand-red/20 hover:text-brand-red transition-colors">
                  ✕
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
