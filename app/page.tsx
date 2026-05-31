import Image from 'next/image'
import HeroBanner from '@/components/HeroBanner'
import ProductGrid from '@/components/ProductGrid'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <HeroBanner />
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-cream leading-tight flex items-center gap-2">
          Our Menu
          <Image src="/biryani.png" alt="biryani" width={36} height={36} className="inline-block" />
        </h2>
        <p className="text-brand-cream/50 text-sm mt-1">
          Dhaka&apos;s tastiest biryani, tehari &amp; khichuri — delivered fast.
        </p>
      </div>
      <ProductGrid />
    </div>
  )
}
