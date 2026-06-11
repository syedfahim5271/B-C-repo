export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  badge?: string
}

export const products: Product[] = [
  {
    id: 'beef-tehari',
    name: 'Beef Tehari',
    description: 'Slow-cooked beef in aromatic saffron rice',
    price: 190,
    image: '/food-hero.png',
    badge: '🔥 Popular',
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani / Tehari',
    description: 'Tender chicken with fragrant basmati rice',
    price: 170,
    image: '/food-hero.png',
    badge: 'Bestseller',
  },
  {
    id: 'chicken-khichuri',
    name: 'Chicken Khichuri',
    description: 'Comfort khichuri with juicy chicken pieces',
    price: 170,
    image: '/food-hero.png',
  },
  {
    id: 'beef-khichuri',
    name: 'Beef Khichuri',
    description: 'Rich beef khichuri, slow-cooked perfection',
    price: 190,
    image: '/food-hero.png',
  },
]

export const AREAS = [
  { id: 'bashundhara', label: 'Bashundhara', emoji: '📍' },
  { id: 'uttara',      label: 'Uttara',      emoji: '🏙️' },
  { id: 'gulshan',     label: 'Gulshan',     emoji: '✨' },
  { id: 'banani',      label: 'Banani',      emoji: '🌿' },
  { id: 'dhanmondi',   label: 'Dhanmondi',   emoji: '🎨' },
  { id: 'mirpur',      label: 'Mirpur',      emoji: '🏘️' },
  { id: 'mohakhali',   label: 'Mohakhali',   emoji: '🌆' },
  { id: 'mohammadpur', label: 'Mohammadpur', emoji: '🕌' },
]

export const WHATSAPP_NUMBER = '8801810098964'
export const PHONE_NUMBER = '01810098964'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20want%20to%20place%20an%20order%20%F0%9F%8D%9A`

export interface PromoCode {
  discount: number
  type: 'percent' | 'flat'
  label: string
}

export const PROMO_CODES: Record<string, PromoCode> = {
  'FIRSTORDER': { discount: 10, type: 'percent', label: '10% off your order' },
  'CHILL20':    { discount: 20, type: 'flat',    label: '৳20 off'            },
  'WELCOME50':  { discount: 50, type: 'flat',    label: '৳50 off'            },
}
