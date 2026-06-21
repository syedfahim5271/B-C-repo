import Image from 'next/image'
import Link from 'next/link'
import type { DBBanner } from '@/lib/supabase'

interface Props { banner: DBBanner | null }

export default function HeroBanner({ banner }: Props) {
  const b = banner ?? {
    badge_text: '🔥 Limited Offer',
    title:      'First order? 10% off',
    subtitle:   'Use code FIRSTORDER at checkout.',
    promo_hint: 'Also try CHILL20 for ৳20 off',
    is_active:  true,
  }

  if (!b.is_active) return null

  return (
    <Link
      href="/profile#referral"
      data-testid="hero-banner"
      aria-label="Get your referral code"
      className="block mx-4 mt-5 mb-2 rounded-3xl overflow-hidden relative bg-brand-darker border border-white/8 transition-transform active:scale-[0.99] hover:border-brand-yellow/30"
    >
      <div className="absolute inset-0">
        <Image src="/food-hero.png" alt="Biryani & Chill" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darker via-brand-darker/80 to-transparent" />
      </div>
      <div className="relative z-10 px-6 py-8 max-w-xs sm:max-w-sm">
        {b.badge_text ? (
          <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            {b.badge_text}
          </span>
        ) : null}
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-cream leading-tight mb-2">
          {b.title}
        </h2>
        <p className="text-brand-cream/60 text-sm mb-4 leading-relaxed">{b.subtitle}</p>
        {b.promo_hint ? <p className="text-brand-cream/40 text-xs">{b.promo_hint}</p> : null}
        <span className="inline-flex items-center gap-1 mt-3 text-brand-yellow text-sm font-semibold">
          Get your referral code →
        </span>
      </div>
    </Link>
  )
}
