import Link from 'next/link'
import { logoutAction } from './actions'

const NAV = [
  { href: '/admin',           label: 'Dashboard',   icon: '📊' },
  { href: '/admin/orders',    label: 'Orders',       icon: '📦' },
  { href: '/admin/menu',      label: 'Menu',         icon: '🍛' },
  { href: '/admin/areas',     label: 'Areas',        icon: '📍' },
  { href: '/admin/banner',    label: 'Banner',       icon: '🎯' },
  { href: '/admin/promos',    label: 'Promo Codes',  icon: '🏷️' },
  { href: '/admin/customers', label: 'Customers',    icon: '👥' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-darker border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/5">
          <p className="font-display font-bold text-brand-yellow text-base">B&amp;C Admin</p>
          <p className="text-brand-cream/30 text-xs mt-0.5">Biryani &amp; Chill</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-cream/60 hover:text-brand-cream hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-cream/40 hover:text-brand-red hover:bg-white/5 transition-colors text-sm font-medium">
              <span>🚪</span> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
