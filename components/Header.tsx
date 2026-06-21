'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, MessageCircle, LogIn } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { WHATSAPP_URL, PHONE_NUMBER } from '@/data/products'
import { useOrderStore } from '@/store/orderStore'
import { useAuthUi } from '@/store/authUiStore'
import UserMenu from '@/components/auth/UserMenu'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const { orders } = useOrderStore()
  const { status } = useSession()
  const { openLogin } = useAuthUi()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <header
      className="sticky top-0 z-50 bg-brand-darker/95 backdrop-blur-sm border-b border-white/5"
      data-testid="header"
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Biryani & Chill home">
          <Image
            src="/logo.png"
            alt="Biryani & Chill"
            width={52}
            height={52}
            className="rounded-full object-cover"
            priority
          />
        </Link>

        {/* Brand name */}
        <Link
          href="/"
          className="hidden sm:block font-display font-bold text-lg text-brand-yellow tracking-tight flex-1"
        >
          Biryani &amp; Chill
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* My Orders */}
          <Link
            href="/orders"
            className={`relative min-tap flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
              pathname === '/orders'
                ? 'bg-brand-yellow/15 text-brand-yellow'
                : 'hover:bg-white/10 text-brand-cream/70 hover:text-brand-cream'
            }`}
            aria-label="My Orders"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
            <span className="hidden sm:inline">My Orders</span>
            {/* Badge showing order count */}
            {mounted && orders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orders.length > 9 ? '9+' : orders.length}
              </span>
            )}
          </Link>

          {/* Phone */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="min-tap flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Call us"
          >
            <Phone size={20} className="text-brand-cream" />
          </a>

          {/* WhatsApp pill */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="whatsapp-button"
            className="min-tap flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={16} className="flex-shrink-0" />
            <span className="hidden sm:inline">Order on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Auth: login button (logged out) or avatar menu (logged in) */}
          {mounted && status === 'authenticated' ? (
            <UserMenu />
          ) : mounted && status === 'unauthenticated' ? (
            <button
              onClick={() => openLogin()}
              data-testid="login-button"
              className="min-tap flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-brand-cream transition-colors"
              aria-label="Login or sign up"
            >
              <LogIn size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">Login</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
