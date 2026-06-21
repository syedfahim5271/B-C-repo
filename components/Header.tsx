'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, MessageCircle, LogIn } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { WHATSAPP_URL, PHONE_NUMBER } from '@/data/products'
import { useAuthUi } from '@/store/authUiStore'
import UserMenu from '@/components/auth/UserMenu'
import { useEffect, useState } from 'react'

export default function Header() {
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
              className="min-tap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-brand-cream transition-colors"
              aria-label="Login or sign up"
            >
              <LogIn size={16} className="flex-shrink-0" />
              <span>Login / Sign Up</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
