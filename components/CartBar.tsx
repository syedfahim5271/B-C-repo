'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { useAuthUi } from '@/store/authUiStore'

export default function CartBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()
  const { openLogin } = useAuthUi()
  const { items, openDrawer } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [prevCount, setPrevCount] = useState(0)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0)

  useEffect(() => {
    if (!mounted) return
    if (totalItems > prevCount) {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 500)
    }
    setPrevCount(totalItems)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, mounted])

  const goToCheckout = () => router.push('/checkout')
  const handleCheckout = () => {
    if (status === 'authenticated') goToCheckout()
    else openLogin(goToCheckout) // login popup first, then continue to checkout
  }

  // Hide the floating checkout bar once the user is already in the checkout flow
  const hideOnRoute = pathname === '/checkout' || pathname === '/confirmation'

  if (!mounted || totalItems === 0 || hideOnRoute) return null

  return (
    <AnimatePresence>
      <motion.div
        key="cart-bar"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe pb-4 pointer-events-none"
        data-testid="cart-bar"
      >
        <div className="max-w-lg mx-auto pointer-events-auto">
          <div className="bg-brand-yellow rounded-2xl shadow-2xl shadow-brand-yellow/20 flex items-center gap-3 px-4 py-3">
            {/* Cart icon + count */}
            <button
              onClick={openDrawer}
              className="relative flex-shrink-0"
              aria-label="Open cart"
              data-testid="open-cart-drawer"
            >
              <ShoppingCart size={24} className="text-brand-dark" />
              <span
                className={`absolute -top-2 -right-2 bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums ${pulsing ? 'animate-pulse-once' : ''}`}
                data-testid="cart-count"
              >
                {totalItems}
              </span>
            </button>

            {/* Subtotal */}
            <button
              onClick={openDrawer}
              className="flex-1 text-left"
              aria-label="View cart"
            >
              <p className="text-brand-dark font-bold text-base leading-none">
                ৳{subtotal}
              </p>
              <p className="text-brand-dark/60 text-xs mt-0.5">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </button>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              data-testid="checkout-btn"
              className="flex items-center gap-2 bg-brand-dark text-brand-cream font-bold text-sm px-5 py-3 rounded-xl hover:bg-brand-dark/80 transition-colors active:scale-95"
              aria-label="Go to checkout"
            >
              Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
