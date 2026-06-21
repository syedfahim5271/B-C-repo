'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useAuthUi } from '@/store/authUiStore'
import { updateProfile } from '@/app/actions'
import type { DBArea } from '@/lib/supabase'

interface SetupForm {
  name: string
  phone: string
  area: string
  address: string
}

export default function ProfileSetupModal({ areas }: { areas: DBArea[] }) {
  const { data: session, update } = useSession()
  const { profileSetupOpen, closeProfileSetup } = useAuthUi()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<SetupForm>({
    defaultValues: { name: session?.user?.name ?? '', phone: '', area: '', address: '' },
  })

  if (!profileSetupOpen) return null

  const onSubmit = async (data: SetupForm) => {
    setSaving(true)
    setError('')
    const res = await updateProfile(data)
    setSaving(false)
    if (res.success) {
      await update() // refresh the JWT so profileComplete becomes true
      closeProfileSetup()
    } else {
      setError(res.error ?? 'Could not save. Try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-brand-darker border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="text-center mb-5">
          <p className="text-3xl mb-2">👋</p>
          <h2 className="font-display font-bold text-xl text-brand-cream">Complete your profile</h2>
          <p className="text-brand-cream/50 text-sm mt-1">We&apos;ll use this to speed up checkout.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div>
            <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Name</label>
            <input {...register('name', { required: 'Tell us your name' })} type="text" placeholder="e.g. Rahim Uddin"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
            {errors.name && <p className="text-brand-red text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Phone Number</label>
            <input {...register('phone', { required: 'Phone number needed for delivery', pattern: { value: /^[\d\s\+\-\(\)]{9,15}$/, message: 'Enter a valid phone number' } })}
              type="tel" placeholder="e.g. 01711-123456"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
            {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Delivery Area</label>
            <select {...register('area', { required: 'Select your area' })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors appearance-none">
              <option value="" disabled className="bg-brand-dark">Select area</option>
              {areas.map((a) => <option key={a.id} value={a.id} className="bg-brand-dark">{a.emoji} {a.label}</option>)}
            </select>
            {errors.area && <p className="text-brand-red text-xs mt-1">{errors.area.message}</p>}
          </div>

          <div>
            <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Delivery Address</label>
            <textarea {...register('address', { required: 'Where should we deliver?' })} rows={2} placeholder="House, Road, Block"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors resize-none" />
            {errors.address && <p className="text-brand-red text-xs mt-1">{errors.address.message}</p>}
          </div>

          {error && <p className="text-brand-red text-sm">{error}</p>}

          <button type="submit" disabled={saving}
            className="w-full bg-brand-yellow text-brand-dark font-bold py-3.5 rounded-2xl hover:bg-brand-gold transition-colors disabled:opacity-60 mt-2">
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
          <button type="button" onClick={closeProfileSetup}
            className="w-full text-brand-cream/40 hover:text-brand-cream text-sm py-1 transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  )
}
