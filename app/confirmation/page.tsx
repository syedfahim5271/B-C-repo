'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER, AREAS } from '@/data/products'

// Meta Pixel's fbq is injected globally by the base code; type it loosely here.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

interface OrderData {
  orderNumber: string
  items: { name: string; price: number; quantity: number }[]
  subtotal: number
  total?: number
  delivery: { name: string; phone: string; area: string; address: string; note?: string }
}

export default function ConfirmationPage() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderData | null>(null)
  const purchaseTracked = useRef(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('bc-order')
    if (!stored) {
      router.replace('/')
      return
    }
    const parsed: OrderData = JSON.parse(stored)
    setOrder(parsed)
    sessionStorage.removeItem('bc-order')

    // Fire the Meta Pixel Purchase event once, only on this success page.
    if (!purchaseTracked.current && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      purchaseTracked.current = true
      window.fbq('track', 'Purchase', {
        value: parsed.total ?? parsed.subtotal ?? 0,
        currency: 'BDT',
      })
    }
  }, [router])

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-yellow border-t-transparent animate-spin" />
      </div>
    )
  }

  const waTrackMsg = encodeURIComponent(
    `Hi! I just placed order ${order.orderNumber}. Can you confirm my delivery? 🍚`
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waTrackMsg}`
  const areaLabel = AREAS.find((a) => a.id === order.delivery.area)?.label ?? order.delivery.area

  return (
    <div className="max-w-lg mx-auto px-4 py-10 text-center">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-8xl mb-4 inline-block"
        data-testid="success-emoji"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-display font-extrabold text-3xl text-brand-yellow mb-2">
          Order Confirmed!
        </h1>
        <p className="text-brand-cream/60 text-base mb-1">
          We&apos;ll WhatsApp you at{' '}
          <span className="text-brand-cream font-semibold">{order.delivery.phone}</span>{' '}
          with updates.
        </p>
        <p className="text-brand-cream/50 text-sm mb-6">
          Estimated delivery: 45–60 mins 🏍️
        </p>

        {/* Order card */}
        <div
          className="bg-white/5 rounded-2xl p-5 text-left space-y-3 mb-6 border border-white/8"
          data-testid="order-summary"
        >
          <div className="flex justify-between items-center border-b border-white/8 pb-3">
            <span className="text-brand-cream/50 text-sm">Order Number</span>
            <span
              className="font-display font-bold text-brand-yellow"
              data-testid="order-number"
            >
              {order.orderNumber}
            </span>
          </div>

          {order.items.map((item) => (
            <div key={item.name} className="flex justify-between text-sm">
              <span className="text-brand-cream/70">
                {item.name} × {item.quantity}
              </span>
              <span className="text-brand-yellow font-semibold">৳{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t border-white/8 pt-3 flex justify-between font-bold">
            <span className="text-brand-cream">Total</span>
            <span className="text-brand-yellow text-lg">৳{order.subtotal}</span>
          </div>

          <div className="border-t border-white/8 pt-3 space-y-1">
            <p className="text-brand-cream/50 text-xs uppercase tracking-widest mb-2">
              Delivering to
            </p>
            <p className="text-brand-cream text-sm">{order.delivery.name}</p>
            <p className="text-brand-cream/60 text-sm">
              {areaLabel} — {order.delivery.address}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="track-whatsapp-btn"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={20} />
            Track via WhatsApp
          </a>
          <Link
            href="/"
            data-testid="order-again-btn"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-brand-cream font-bold py-4 rounded-2xl hover:bg-white/20 transition-colors"
          >
            Order Again 🍚
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
