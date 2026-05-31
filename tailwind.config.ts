import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFB800',
          gold:   '#F5A623',
          red:    '#E8231A',
          dark:   '#111111',
          darker: '#0A0A0A',
          cream:  '#FFF8E7',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'sans-serif'],
      },
      animation: {
        'cart-bounce': 'cartBounce 0.4s cubic-bezier(0.36,0.07,0.19,0.97)',
        'slide-up':    'slideUp 0.3s ease-out',
        'fade-in':     'fadeIn 0.25s ease-out',
        'pulse-once':  'pulseOnce 0.5s ease-in-out',
      },
      keyframes: {
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%':      { transform: 'scale(1.3)' },
          '60%':      { transform: 'scale(0.9)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
