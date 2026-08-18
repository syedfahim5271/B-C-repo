'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { STORE_CLOSED, CLOSED_LABEL } from '@/lib/storeStatus'
import type { DBProduct } from '@/lib/supabase'

interface Props {
  product: DBProduct
}

export default function ProductCard({ product }: Props) {
  const { items, addItem, updateQuantity } = useCartStore()
  const [bouncing, setBouncing] = useState(false)

  const cartItem = items.find((i) => i.id === product.id)
  const qty = cartItem?.quantity ?? 0

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image_url })
    setBouncing(true)
    setTimeout(() => setBouncing(false), 400)
  }

  const handleIncrease = () => {
    updateQuantity(product.id, qty + 1)
  }

  const handleDecrease = () => {
    updateQuantity(product.id, qty - 1)
  }

  return (
    <article
      className="bg-white/5 rounded-2xl overflow-hidden border border-white/8 hover:border-brand-yellow/30 transition-all duration-300 flex flex-col animate-fade-in"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="font-display font-bold text-brand-cream text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-brand-cream/50 text-sm mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-display font-bold text-brand-yellow text-xl">
            ৳{product.price}
          </span>

          {STORE_CLOSED ? (
            <span
              data-testid={`closed-${product.id}`}
              className="min-tap flex items-center text-brand-cream/40 font-semibold text-xs px-4 py-2.5 rounded-full bg-white/5 border border-white/10 cursor-not-allowed"
            >
              {CLOSED_LABEL}
            </span>
          ) : (
          <AnimatePresence mode="wait">
            {qty === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleAdd}
                data-testid={`add-to-cart-${product.id}`}
                className={`
                  min-tap flex items-center gap-1.5 bg-brand-yellow text-brand-dark
                  font-bold text-sm px-4 py-2.5 rounded-full transition-all
                  hover:bg-brand-gold active:scale-95
                  ${bouncing ? 'animate-cart-bounce' : ''}
                `}
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus size={16} />
                Add
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 bg-brand-yellow/10 border border-brand-yellow/40 rounded-full p-1"
              >
                <button
                  onClick={handleDecrease}
                  data-testid={`decrease-${product.id}`}
                  className="min-tap w-8 h-8 flex items-center justify-center rounded-full bg-brand-yellow text-brand-dark hover:bg-brand-gold transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-7 text-center font-bold text-brand-yellow text-sm tabular-nums"
                  data-testid={`qty-${product.id}`}
                >
                  {qty}
                </span>
                <button
                  onClick={handleIncrease}
                  data-testid={`increase-${product.id}`}
                  className="min-tap w-8 h-8 flex items-center justify-center rounded-full bg-brand-yellow text-brand-dark hover:bg-brand-gold transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </article>
  )
}
