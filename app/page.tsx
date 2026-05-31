import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { products as staticProducts, AREAS as staticAreas } from '@/data/products'
import type { DBProduct, DBArea, DBBanner } from '@/lib/supabase'
import HeroBanner from '@/components/HeroBanner'
import ProductGrid from '@/components/ProductGrid'
import AreaSelector from '@/components/AreaSelector'

async function getData() {
  try {
    const [productsRes, areasRes, bannerRes] = await Promise.all([
      supabase.from('products').select('*').eq('is_available', true).order('sort_order'),
      supabase.from('areas').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('banner').select('*').eq('id', 1).single(),
    ])
    return {
      products: (productsRes.data as DBProduct[]) ?? staticProducts.map(p => ({ ...p, image_url: p.image, is_available: true, sort_order: 0, badge: p.badge ?? null })),
      areas:    (areasRes.data   as DBArea[])    ?? staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 })),
      banner:   (bannerRes.data  as DBBanner)    ?? null,
    }
  } catch {
    return {
      products: staticProducts.map(p => ({ ...p, image_url: p.image, is_available: true, sort_order: 0, badge: p.badge ?? null })),
      areas:    staticAreas.map(a => ({ ...a, is_active: true, sort_order: 0 })),
      banner:   null,
    }
  }
}

export const revalidate = 60 // ISR — refresh every 60s

export default async function HomePage() {
  const { products, areas, banner } = await getData()

  return (
    <div className="max-w-5xl mx-auto">
      <HeroBanner banner={banner} />
      <AreaSelector areas={areas} />
      <div className="px-4 pt-3 pb-3">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-cream leading-tight flex items-center gap-2">
          Our Menu
          <Image src="/biryani.png" alt="biryani" width={36} height={36} className="inline-block" />
        </h2>
        <p className="text-brand-cream/50 text-sm mt-1">
          Dhaka&apos;s tastiest biryani, tehari &amp; khichuri — delivered fast.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}
