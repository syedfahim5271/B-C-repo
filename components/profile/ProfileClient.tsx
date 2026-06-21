'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Pencil, Copy, Check, Gift, MessageCircle } from 'lucide-react'
import { updateProfile } from '@/app/actions'
import type { DBArea, DBReward, DBUser } from '@/lib/supabase'

interface Props {
  user: DBUser
  rewards: DBReward[]
  areas: DBArea[]
}

interface ProfileForm {
  name: string
  phone: string
  area: string
  address: string
}

export default function ProfileClient({ user, rewards, areas }: Props) {
  const { update } = useSession()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedReward, setCopiedReward] = useState<string | null>(null)

  const areaLabel = areas.find(a => a.id === user.area)?.label ?? user.area ?? '—'

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user.name ?? '',
      phone: user.phone ?? '',
      area: user.area ?? '',
      address: user.address ?? '',
    },
  })

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    const res = await updateProfile(data)
    setSaving(false)
    if (res.success) {
      await update()
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    }
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(user.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyReward = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedReward(code)
    setTimeout(() => setCopiedReward(null), 2000)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareText = `Get 25% off your first Biryani & Chill order! 🍚 Use my code ${user.referral_code} at checkout. ${shareUrl}`
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="font-display font-bold text-2xl text-brand-cream">My Profile</h1>

      {/* ---- Details ---- */}
      <section className="bg-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-brand-cream">Delivery Details</h2>
          {!editing && (
            <button onClick={() => { reset(); setEditing(true) }}
              className="flex items-center gap-1.5 text-sm text-brand-yellow hover:text-brand-gold transition-colors">
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-2.5 text-sm">
            {([
              ['Name', user.name],
              ['Phone', user.phone],
              ['Area', areaLabel],
              ['Address', user.address],
              ['Email', user.email],
            ] as [string, string | null][]).map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <span className="text-brand-cream/40 w-16 flex-shrink-0">{label}</span>
                <span className="text-brand-cream/85">{value || <span className="text-brand-cream/30">Not set</span>}</span>
              </div>
            ))}
            {saved && <p className="text-brand-yellow text-sm pt-1">✓ Saved</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Name</label>
              <input {...register('name', { required: 'Required' })} type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors" />
              {errors.name && <p className="text-brand-red text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Phone</label>
              <input {...register('phone', { required: 'Required', pattern: { value: /^[\d\s\+\-\(\)]{9,15}$/, message: 'Enter a valid phone number' } })} type="tel"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors" />
              {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Area</label>
              <select {...register('area', { required: 'Required' })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors appearance-none">
                <option value="" disabled className="bg-brand-dark">Select area</option>
                {areas.map(a => <option key={a.id} value={a.id} className="bg-brand-dark">{a.emoji} {a.label}</option>)}
              </select>
              {errors.area && <p className="text-brand-red text-xs mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Address</label>
              <textarea {...register('address', { required: 'Required' })} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors resize-none" />
              {errors.address && <p className="text-brand-red text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setEditing(false)}
                className="bg-white/10 text-brand-cream font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-brand-yellow text-brand-dark font-bold py-2.5 rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-60 text-sm">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ---- Referral code ---- */}
      <section id="referral" className="scroll-mt-20 bg-gradient-to-br from-brand-yellow/15 to-white/5 border border-brand-yellow/20 rounded-2xl p-5">
        <h2 className="font-display font-semibold text-brand-cream mb-1">Your Referral Code</h2>
        <p className="text-brand-cream/50 text-sm mb-4">Share it — friends get 25% off, and you earn a 25% reward for each one who orders.</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-brand-dark/60 border border-brand-yellow/30 rounded-xl px-4 py-3 font-display font-bold text-brand-yellow text-lg tracking-widest text-center" data-testid="referral-code">
            {user.referral_code}
          </div>
          <button onClick={copyCode} aria-label="Copy referral code"
            className="min-tap w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-brand-cream">
            {copied ? <Check size={18} className="text-brand-yellow" /> : <Copy size={18} />}
          </button>
        </div>
        <a href={whatsappShare} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors">
          <MessageCircle size={18} /> Share on WhatsApp
        </a>
      </section>

      {/* ---- Rewards ---- */}
      <section id="rewards">
        <h2 className="font-display font-semibold text-brand-cream mb-1 flex items-center gap-2">
          <Gift size={18} className="text-brand-yellow" /> My Rewards
        </h2>
        <p className="text-brand-cream/50 text-sm mb-4">Earned when someone orders with your referral code.</p>

        {rewards.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-6 text-center">
            <p className="text-brand-cream/40 text-sm">No rewards yet. Share your code to start earning! 🎁</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {rewards.map(r => (
              <div key={r.id} data-testid={`reward-${r.code}`}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 border ${
                  r.is_used ? 'bg-white/3 border-white/8 opacity-60' : 'bg-brand-yellow/10 border-brand-yellow/25'
                }`}>
                <div className="min-w-0">
                  <p className={`font-display font-bold tracking-wider ${r.is_used ? 'text-brand-cream/50 line-through' : 'text-brand-yellow'}`}>
                    {r.code}
                  </p>
                  <p className="text-brand-cream/50 text-xs mt-0.5">
                    Use this for 25% off your next order — valid once only
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!r.is_used && (
                    <button
                      onClick={() => copyReward(r.code)}
                      aria-label={`Copy reward code ${r.code}`}
                      data-testid={`copy-reward-${r.code}`}
                      className="min-tap w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-brand-cream"
                    >
                      {copiedReward === r.code ? <Check size={16} className="text-brand-yellow" /> : <Copy size={16} />}
                    </button>
                  )}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    r.is_used ? 'bg-white/10 text-brand-cream/40' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {r.is_used ? 'Used' : 'Available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
