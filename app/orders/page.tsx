'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore, type StoredOrder } from '@/store/orderStore'
import { AREAS, WHATSAPP_NUMBER } from '@/data/products'

function OrderCard({ order }: { order: StoredOrder }) {
  const [expanded, setExpanded] = useState(false)

  const areaLabel = AREAS.find((a) => a.id === order.delivery.area)?.label ?? order.delivery.area
  const date      = new Date(order.placedAt)
  const dateStr   = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr   = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const waMsg = encodeURIComponent(`Hi! I placed order ${order.orderNumber} on ${dateStr}. Can you help me track it? 🍚`)
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`

  return (
    <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-brand-yellow text-sm">{order.orderNumber}</span>
            <span className="bg-brand-yellow/10 text-brand-yellow text-xs px-2 py-0.5 rounded-full font-medium">
              Placed
            </span>
          </div>
          <p className="text-brand-cream/50 text-xs mt-1">
            {dateStr} at {timeStr} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ৳{order.total}
          </p>
        </div>
        <div className="text-brand-cream/40 ml-3 flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/8 pt-4 space-y-4">
              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-brand-cream/70">{item.name} × {item.quantity}</span>
                    <span className="text-brand-yellow font-semibold">৳{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-white/8 pt-2 space-y-1">
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-cream/50">Discount {order.promoCode && `(${order.promoCode})`}</span>
                      <span className="text-brand-yellow">−৳{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span className="text-brand-cream">Total</span>
                    <span className="text-brand-yellow">৳{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-white/5 rounded-xl p-3 space-y-1.5 text-sm">
                <p className="text-brand-cream/40 text-xs uppercase tracking-widest mb-2">Delivery</p>
                <p className="text-brand-cream/80">{order.delivery.name}</p>
                <p className="text-brand-cream/60">{areaLabel} — {order.delivery.address}</p>
                <p className="text-brand-cream/60">{order.delivery.phone}</p>
                {order.delivery.note && <p className="text-brand-cream/40 italic">"{order.delivery.note}"</p>}
              </div>

              {/* WhatsApp follow-up */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold text-sm py-3 rounded-xl hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle size={16} />
                Ask about this order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function OrdersPage() {
  const { orders, clearOrders } = useOrderStore()
  const [mounted, setMounted]   = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-yellow border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-cream">My Orders</h1>
          <p className="text-brand-cream/40 text-sm mt-0.5">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => { if (confirm('Clear all order history?')) clearOrders() }}
            className="text-brand-cream/30 hover:text-brand-red text-xs transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">🍚</span>
          <h2 className="font-display font-bold text-xl text-brand-cream mb-2">No orders yet</h2>
          <p className="text-brand-cream/50 mb-6">Your order history will appear here.</p>
          <Link
            href="/"
            className="bg-brand-yellow text-brand-dark font-bold px-6 py-3 rounded-full hover:bg-brand-gold transition-colors"
          >
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.orderNumber} order={order} />
          ))}

          <div className="pt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-brand-yellow text-brand-dark font-bold px-8 py-3 rounded-full hover:bg-brand-gold transition-colors"
            >
              Order Again 🍚
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
