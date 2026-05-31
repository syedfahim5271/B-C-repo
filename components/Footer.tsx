import { Phone, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL, PHONE_NUMBER } from '@/data/products'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-white/8 px-4 py-10 mt-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-xl text-brand-yellow">
              Biryani &amp; Chill
            </p>
            <p className="text-brand-cream/50 text-sm mt-1">
              Hot. Hygienic. Heart-stealing.
            </p>
          </div>

          {/* Social + Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-brand-cream/40 text-xs uppercase tracking-widest font-medium">
              Follow Us
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/biryaniandchill/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="facebook-link"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/biryaniandchill.bd/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="instagram-link"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Call us"
              >
                <Phone size={18} />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-4 text-center text-brand-cream/30 text-xs">
          © 2026 Biryani &amp; Chill. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
