import type { Metadata, Viewport } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import ClosedBanner from '@/components/ClosedBanner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CartBar from '@/components/CartBar'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Biryani & Chill — Hot biryani. Zero drama.',
  description:
    'Order the best biryani in Dhaka. Beef Tehari, Chicken Biryani, Khichuri — delivered fast. No account needed.',
  keywords: ['biryani', 'tehari', 'khichuri', 'dhaka', 'food delivery', 'bangladesh'],
  openGraph: {
    title: 'Biryani & Chill',
    description: 'Hot biryani. Zero drama.',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#111111',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable}`}>
      <body className="font-body bg-brand-dark text-brand-cream min-h-screen">
        <ClosedBanner />
        <Header />
        <main className="pb-28">{children}</main>
        <Footer />
        <CartDrawer />
        <CartBar />
      </body>
    </html>
  )
}
