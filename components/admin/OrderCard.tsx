'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { DBOrder } from '@/lib/supabase'
import { updateOrderStatus } from '@/app/admin/actions'
import { AREAS } from '@/data/products'

const STATUS_FLOW = [
  { value: 'pending',    label: 'Pending',    color: 'bg-yellow-500/20 text-yellow-400',  next: 'confirmed'  },
  { value: 'confirmed',  label: 'Confirmed',  color: 'bg-blue-500/20 text-blue-400',      next: 'preparing'  },
  { value: 'preparing',  label: 'Preparing',  color: 'bg-orange-500/20 text-orange-400',  next: 'on-the-way' },
  { value: 'on-the-way', label: 'On the Way', color: 'bg-purple-500/20 text-purple-400',  next: 'delivered'  },
  { value: 'delivered',  label: 'Delivered',  color: 'bg-green-500/20 text-green-400',    next: null         },
  { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-500/20 text-red-400',        next: null         },
]

function statusMeta(s: string) {
  return STATUS_FLOW.find(f => f.value === s) ?? { value: s, label: s, color: 'bg-white/10 text-brand-cream/50', next: null }
}

export default function OrderCard({ order }: { order: DBOrder }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus]     = useState(order.status)
  const [isPending, startTransition] = useTransition()
  const meta = statusMeta(status)
  const areaLabel = AREAS.find(a => a.id === order.delivery.area)?.label ?? order.delivery.area
  const date = new Date(order.placed_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  const changeStatus = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, newStatus)
      setStatus(newStatus)
    })
  }

  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${expanded ? 'border-brand-yellow/30 bg-white/5' : 'border-white/8 bg-white/3 hover:bg-white/5'}`}>
      {/* Header row — always visible, click to expand */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-brand-yellow text-sm">{order.order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${meta.color}`}>
              {meta.label}
            </span>
            {order.promo_code && (
              <span className="text-xs bg-brand-yellow/10 text-brand-yellow px-2 py-0.5 rounded-full border border-brand-yellow/20">
                🏷️ {order.promo_code}
              </span>
            )}
          </div>
          <p className="text-brand-cream font-medium mt-0.5">{order.delivery.name}</p>
          <p className="text-brand-cream/50 text-sm">{order.delivery.phone} · {areaLabel}</p>
        </div>
        <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
          <p className="text-brand-yellow font-bold text-lg">৳{order.total}</p>
          <p className="text-brand-cream/30 text-xs">{date}</p>
          {expanded ? <ChevronUp size={16} className="text-brand-cream/40" /> : <ChevronDown size={16} className="text-brand-cream/40" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/8 space-y-4 pt-4">
          {/* Items */}
          <div className="space-y-2">
            <p className="text-brand-cream/40 text-xs uppercase tracking-widest font-medium">Items</p>
            {order.items.map((item: { id: string; name: string; quantity: number; price: number }) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-brand-cream/80">{item.name} × {item.quantity}</span>
                <span className="text-brand-yellow font-semibold">৳{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-white/8 pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/50">Subtotal</span>
                <span className="text-brand-cream">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/50">Delivery charge</span>
                <span className="text-brand-cream">৳{order.delivery_charge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-yellow/70">Discount</span>
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
            <p className="text-brand-cream/40 text-xs uppercase tracking-widest mb-1">Delivery Details</p>
            <p className="text-brand-cream/80">{order.delivery.name}</p>
            <p className="text-brand-cream/60">{areaLabel} — {order.delivery.address}</p>
            <p className="text-brand-cream/60">{order.delivery.phone}</p>
            {order.delivery.note && (
              <p className="text-brand-cream/40 italic text-xs">&ldquo;{order.delivery.note}&rdquo;</p>
            )}
          </div>

          {/* Status quick actions */}
          {status !== 'delivered' && status !== 'cancelled' && (
            <div className="space-y-2">
              <p className="text-brand-cream/40 text-xs uppercase tracking-widest font-medium">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {/* Next step button */}
                {meta.next && (
                  <button
                    onClick={() => changeStatus(meta.next!)}
                    disabled={isPending}
                    className="flex-1 bg-brand-yellow text-brand-dark font-bold py-2.5 px-4 rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-60 text-sm"
                  >
                    {isPending ? 'Updating…' : `Mark as ${statusMeta(meta.next).label} →`}
                  </button>
                )}
                {/* Cancel button */}
                <button
                  onClick={() => changeStatus('cancelled')}
                  disabled={isPending}
                  className="bg-brand-red/20 text-brand-red font-semibold py-2.5 px-4 rounded-xl hover:bg-brand-red/30 transition-colors disabled:opacity-60 text-sm"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* Final status badge */}
          {(status === 'delivered' || status === 'cancelled') && (
            <div className={`text-center py-2 rounded-xl text-sm font-bold ${meta.color}`}>
              {status === 'delivered' ? '✅ Order Delivered' : '❌ Order Cancelled'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
