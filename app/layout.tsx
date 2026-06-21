import type { Metadata, Viewport } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ClosedBanner from '@/components/ClosedBanner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CartBar from '@/components/CartBar'
import Providers from '@/components/auth/Providers'
import AuthModals from '@/components/auth/AuthModals'

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
        {/* Meta (Facebook) Pixel — base code, loads on every page */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2557365318046267');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://www.facebook.com/tr?id=2557365318046267&ev=PageView&noscript=1"
          />
        </noscript>

        <Providers>
          <ClosedBanner />
          <Header />
          <main className="pb-28">{children}</main>
          <Footer />
          <CartDrawer />
          <CartBar />
          <AuthModals />
        </Providers>
      </body>
    </html>
  )
}
