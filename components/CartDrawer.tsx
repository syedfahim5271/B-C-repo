'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

export default function CartDrawer() {
  const router = useRouter()
  const { items, isDrawerOpen, closeDrawer, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleCheckout = () => {
    closeDrawer()
    router.push('/checkout')
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-3xl max-h-[85vh] flex flex-col"
            data-testid="cart-drawer"
            role="dialog"
            aria-label="Your cart"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-brand-yellow" />
                <h2 className="font-display font-bold text-lg text-brand-cream">
                  Your Cart
                </h2>
                <span className="bg-brand-yellow text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="text-brand-cream/50 font-medium">Your cart is empty</p>
                  <p className="text-brand-cream/30 text-sm mt-1">Add some biryani!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-cream text-sm leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-brand-yellow font-bold text-base mt-0.5">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`drawer-decrease-${item.id}`}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={13} className="text-brand-red" />
                        ) : (
                          <Minus size={13} />
                        )}
                      </button>
                      <span className="w-7 text-center font-bold text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`drawer-increase-${item.id}`}
                        className="w-8 h-8 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center hover:bg-brand-gold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 pt-4 pb-8 border-t border-white/8 flex-shrink-0 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-cream/60 text-sm">Subtotal</span>
                  <span className="font-display font-bold text-xl text-brand-yellow">
                    ৳{subtotal}
                  </span>
                </div>
                <p className="text-brand-cream/40 text-xs">
                  Delivery charge varies by area
                </p>
                <button
                  onClick={handleCheckout}
                  data-testid="proceed-checkout-btn"
                  className="w-full bg-brand-yellow text-brand-dark font-bold text-base py-4 rounded-2xl hover:bg-brand-gold transition-colors active:scale-[0.98]"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
