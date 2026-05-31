'use client'

import { products } from '@/data/products'
import ProductCard from './ProductCard'

export default function ProductGrid() {
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
