'use client'

import ProductCard from './ProductCard'
import type { DBProduct } from '@/lib/supabase'

interface Props { products: DBProduct[] }

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-brand-cream/60">
        <p className="text-4xl mb-3">🍛</p>
        <p className="font-display font-bold text-lg text-brand-cream">Sold out today.</p>
        <p className="mt-1">Thanks for the love! See you soon...</p>
      </div>
    )
  }

  return (
    <section aria-label="Menu" className="px-4 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
