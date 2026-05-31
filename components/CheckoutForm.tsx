'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Minus, Plus, Trash2, Tag, CheckCircle2, XCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useOrderStore } from '@/store/orderStore'
import { AREAS, PROMO_CODES } from '@/data/products'

interface DeliveryForm {
  name: string
  phone: string
  area: string
  address: string
  note?: string
}

const stepVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function CheckoutForm() {
  const router = useRouter()
  const { items, selectedArea, updateQuantity, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Promo code state
  const [promoInput, setPromoInput]     = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError]     = useState('')

  const DELIVERY_CHARGE = 30

  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  const promoData  = appliedPromo ? PROMO_CODES[appliedPromo] : null
  const discount   = promoData
    ? promoData.type === 'percent'
      ? Math.round(subtotal * promoData.discount / 100)
      : promoData.discount
    : 0
  const total = subtotal - discount + DELIVERY_CHARGE

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<DeliveryForm>({
    defaultValues: { area: selectedArea || '' },
  })

  const goNext = () => { setDirection(1);  setStep((s) => s + 1) }
  const goBack = () => { setDirection(-1); setStep((s) => s - 1) }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try FIRSTORDER or CHILL20.')
      setAppliedPromo(null)
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  const onSubmit = (data: DeliveryForm) => {
    setSubmitting(true)
    const orderNum = `BC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`

    const orderData = {
      orderNumber: orderNum,
      items,
      subtotal,
      discount,
      total,
      promoCode: appliedPromo ?? undefined,
      delivery: data,
      placedAt: new Date().toISOString(),
    }

    // Persist to order history in localStorage
    addOrder(orderData)

    // Pass to confirmation page via sessionStorage
    sessionStorage.setItem('bc-order', JSON.stringify(orderData))
    clearCart()

    setTimeout(() => router.push('/confirmation'), 300)
  }

  if (items.length === 0 && step === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="font-display font-bold text-xl text-brand-cream mb-2">Your cart is empty</h2>
        <p className="text-brand-cream/50 mb-6">Add some biryani first!</p>
        <button
          onClick={() => router.push('/')}
          className="bg-brand-yellow text-brand-dark font-bold px-6 py-3 rounded-full hover:bg-brand-gold transition-colors"
        >
          Browse Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step === s ? 'bg-brand-yellow text-brand-dark scale-110'
              : step > s  ? 'bg-brand-yellow/40 text-brand-yellow'
              : 'bg-white/10 text-brand-cream/40'
            }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-10 rounded-full transition-all duration-300 ${step > s ? 'bg-brand-yellow/40' : 'bg-white/10'}`} />}
          </div>
        ))}
        <p className="ml-2 text-brand-cream/50 text-sm">
          {step === 1 ? 'Confirm Cart' : step === 2 ? 'Delivery Details' : 'Review & Confirm'}
        </p>
      </div>

      <AnimatePresence mode="wait" custom={direction}>

        {/* ---- STEP 1: Cart + Promo ---- */}
        {step === 1 && (
          <motion.div key="step1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <h1 className="font-display font-bold text-2xl text-brand-cream mb-5">Your Order</h1>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3" data-testid={`checkout-item-${item.id}`}>
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-cream text-sm truncate">{item.name}</p>
                    <p className="text-brand-yellow font-bold">৳{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Decrease">
                      {item.quantity === 1 ? <Trash2 size={13} className="text-brand-red" /> : <Minus size={13} />}
                    </button>
                    <span className="w-7 text-center font-bold text-sm tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center hover:bg-brand-gold transition-colors" aria-label="Increase">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <p className="text-brand-cream/60 text-sm font-medium mb-3 flex items-center gap-1.5">
                <Tag size={14} />
                Promo Code
              </p>

              {appliedPromo ? (
                <div className="flex items-center justify-between bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-yellow" />
                    <div>
                      <p className="text-brand-yellow font-bold text-sm">{appliedPromo}</p>
                      <p className="text-brand-cream/50 text-xs">{promoData?.label} applied!</p>
                    </div>
                  </div>
                  <button onClick={removePromo} className="text-brand-cream/40 hover:text-brand-cream transition-colors" aria-label="Remove promo">
                    <XCircle size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    type="text"
                    placeholder="Enter promo code"
                    data-testid="promo-input"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors text-sm uppercase tracking-wider"
                  />
                  <button
                    onClick={applyPromo}
                    data-testid="apply-promo-btn"
                    className="bg-brand-yellow text-brand-dark font-bold px-4 py-2.5 rounded-xl hover:bg-brand-gold transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-brand-red text-xs mt-2">{promoError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/60">Subtotal</span>
                <span className="text-brand-cream">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/60">Delivery charge</span>
                <span className="text-brand-cream">৳{DELIVERY_CHARGE}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-yellow/80">Discount ({appliedPromo})</span>
                  <span className="text-brand-yellow font-semibold">−৳{discount}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span className="text-brand-cream">Total</span>
                <span className="text-brand-yellow text-xl">৳{total}</span>
              </div>
            </div>

            <button onClick={goNext} data-testid="step1-next" className="w-full bg-brand-yellow text-brand-dark font-bold text-base py-4 rounded-2xl hover:bg-brand-gold transition-colors flex items-center justify-center gap-2">
              Next — Delivery Details <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* ---- STEP 2: Delivery Details ---- */}
        {step === 2 && (
          <motion.div key="step2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <h1 className="font-display font-bold text-2xl text-brand-cream mb-5">Delivery Details</h1>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Your Name <span className="text-brand-red">*</span></label>
                <input {...register('name', { required: 'Tell us your name 👋' })} type="text" placeholder="e.g. Rahim Uddin" data-testid="input-name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
                {errors.name && <p className="text-brand-red text-sm mt-1.5" data-testid="error-name">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Phone Number <span className="text-brand-red">*</span></label>
                <input {...register('phone', { required: 'Oops! Tell us your phone number so we can reach you 📞', pattern: { value: /^[\d\s\+\-\(\)]{9,15}$/, message: 'Please enter a valid phone number' } })}
                  type="tel" placeholder="e.g. 01711-123456" data-testid="input-phone"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
                {errors.phone && <p className="text-brand-red text-sm mt-1.5" data-testid="error-phone">{errors.phone.message}</p>}
              </div>

              {/* Area */}
              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Delivery Area <span className="text-brand-red">*</span></label>
                <select {...register('area', { required: 'Select your delivery area' })} data-testid="input-area"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream focus:outline-none focus:border-brand-yellow/60 transition-colors appearance-none">
                  <option value="" disabled className="bg-brand-dark">Select area</option>
                  {AREAS.map((a) => <option key={a.id} value={a.id} className="bg-brand-dark">{a.emoji} {a.label}</option>)}
                </select>
                {errors.area && <p className="text-brand-red text-sm mt-1.5" data-testid="error-area">{errors.area.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Delivery Address <span className="text-brand-red">*</span></label>
                <textarea {...register('address', { required: 'Tell us where to deliver 🏠' })} rows={3} placeholder="House, Road, Block — be specific so we find you fast" data-testid="input-address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors resize-none" />
                {errors.address && <p className="text-brand-red text-sm mt-1.5" data-testid="error-address">{errors.address.message}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="block text-brand-cream/70 text-sm font-medium mb-1.5">Order Note <span className="text-brand-cream/30 font-normal">(optional)</span></label>
                <input {...register('note')} type="text" placeholder="e.g. Less spicy please, extra raita" data-testid="input-note"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-cream placeholder:text-brand-cream/30 focus:outline-none focus:border-brand-yellow/60 transition-colors" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={goBack} className="flex items-center gap-2 bg-white/10 text-brand-cream font-semibold px-5 py-4 rounded-2xl hover:bg-white/20 transition-colors">
                <ChevronLeft size={20} /> Back
              </button>
              <button onClick={() => { handleSubmit(() => goNext())() }} data-testid="step2-next"
                className="flex-1 bg-brand-yellow text-brand-dark font-bold py-4 rounded-2xl hover:bg-brand-gold transition-colors flex items-center justify-center gap-2">
                Review Order <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ---- STEP 3: Review ---- */}
        {step === 3 && (
          <motion.div key="step3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <h1 className="font-display font-bold text-2xl text-brand-cream mb-5">Review &amp; Confirm</h1>

            {/* Items */}
            <div className="bg-white/5 rounded-2xl p-4 mb-4 space-y-3">
              <p className="text-brand-cream/50 text-xs uppercase tracking-widest font-medium">Items ({totalItems})</p>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-brand-cream/80">{item.name} × {item.quantity}</span>
                  <span className="text-brand-yellow font-semibold">৳{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Subtotal</span>
                  <span className="text-brand-cream">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Delivery charge</span>
                  <span className="text-brand-cream">৳{DELIVERY_CHARGE}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-yellow/80">Discount ({appliedPromo})</span>
                    <span className="text-brand-yellow font-semibold">−৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1">
                  <span className="text-brand-cream">Total</span>
                  <span className="text-brand-yellow text-lg">৳{total}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-2">
              <p className="text-brand-cream/50 text-xs uppercase tracking-widest font-medium mb-3">Delivery to</p>
              {([
                ['Name',    getValues('name')],
                ['Phone',   getValues('phone')],
                ['Area',    AREAS.find((a) => a.id === getValues('area'))?.label ?? getValues('area')],
                ['Address', getValues('address')],
                ...(getValues('note') ? [['Note', getValues('note')]] : []),
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-brand-cream/40 w-16 flex-shrink-0">{label}</span>
                  <span className="text-brand-cream/80">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={goBack} className="flex items-center gap-2 bg-white/10 text-brand-cream font-semibold px-5 py-4 rounded-2xl hover:bg-white/20 transition-colors">
                <ChevronLeft size={20} /> Back
              </button>
              <button onClick={handleSubmit(onSubmit)} disabled={submitting} data-testid="place-order-btn"
                className="flex-1 bg-brand-yellow text-brand-dark font-bold py-4 rounded-2xl hover:bg-brand-gold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base">
                {submitting ? 'Placing order…' : '🍚 Place Order'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
