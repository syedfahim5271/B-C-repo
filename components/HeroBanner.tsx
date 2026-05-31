import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="mx-4 mt-5 mb-2 rounded-3xl overflow-hidden relative bg-brand-darker border border-white/8">
      {/* Background food image */}
      <div className="absolute inset-0">
        <Image
          src="/food-hero.png"
          alt="Biryani & Chill"
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* gradient overlay — left readable, right fades to image */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darker via-brand-darker/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-8 max-w-xs sm:max-w-sm">
        <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
          🔥 Limited Offer
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-cream leading-tight mb-2">
          First order?{' '}
          <span className="text-brand-yellow">10% off</span>
        </h2>
        <p className="text-brand-cream/60 text-sm mb-4 leading-relaxed">
          Use code{' '}
          <span className="text-brand-yellow font-bold tracking-widest bg-brand-yellow/10 px-2 py-0.5 rounded">
            FIRSTORDER
          </span>{' '}
          at checkout.
        </p>
        <p className="text-brand-cream/40 text-xs">
          Also try <span className="text-brand-cream/60 font-medium">CHILL20</span> for ৳20 off
        </p>
      </div>
    </section>
  )
}
