import { supabase } from '@/lib/supabase'
import type { DBBanner } from '@/lib/supabase'
import { updateBanner } from '../actions'
export const dynamic = 'force-dynamic'


export default async function BannerPage() {
  const { data } = await supabase.from('banner').select('*').eq('id', 1).single()
  const banner: DBBanner = data ?? {
    id: 1, badge_text: '🔥 Limited Offer', title: 'First order? 10% off',
    subtitle: 'Use code FIRSTORDER at checkout.', promo_hint: 'Also try CHILL20 for ৳20 off', is_active: true,
  }

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h1 className="font-display font-bold text-2xl text-brand-cream">Banner</h1>

      {/* Live preview */}
      <div className="rounded-2xl overflow-hidden bg-brand-darker border border-white/8 p-6">
        <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          {banner.badge_text}
        </span>
        <h2 className="font-display font-extrabold text-2xl text-brand-cream mb-2">{banner.title}</h2>
        <p className="text-brand-cream/60 text-sm mb-2">{banner.subtitle}</p>
        <p className="text-brand-cream/40 text-xs">{banner.promo_hint}</p>
      </div>

      {/* Edit form */}
      <form action={updateBanner} className="bg-white/5 rounded-2xl p-5 border border-white/8 space-y-4">
        <h2 className="font-display font-bold text-brand-cream">Edit Banner</h2>

        {[
          { name: 'badge_text', label: 'Badge Text',  placeholder: '🔥 Limited Offer',              defaultValue: banner.badge_text },
          { name: 'title',      label: 'Headline',    placeholder: 'First order? 10% off',           defaultValue: banner.title },
          { name: 'subtitle',   label: 'Subtitle',    placeholder: 'Use code FIRSTORDER at checkout', defaultValue: banner.subtitle },
          { name: 'promo_hint', label: 'Promo Hint',  placeholder: 'Also try CHILL20 for ৳20 off',   defaultValue: banner.promo_hint },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-brand-cream/60 text-sm font-medium mb-1.5">{f.label}</label>
            <input name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors text-sm" />
          </div>
        ))}

        <div className="flex items-center gap-3">
          <input type="hidden" name="is_active" value={banner.is_active ? 'true' : 'false'} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" value="true" defaultChecked={banner.is_active}
              onChange={e => { const h = e.target.form?.querySelector<HTMLInputElement>('input[type=hidden][name=is_active]'); if (h) h.value = e.target.checked ? 'true' : 'false' }}
              className="w-4 h-4 accent-yellow-400 rounded" />
            <span className="text-brand-cream/70 text-sm">Banner active</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold transition-colors">
          Save Banner
        </button>
      </form>
    </div>
  )
}
