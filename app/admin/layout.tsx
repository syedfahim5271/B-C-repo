import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/auth'
import OrderNotifier from '@/components/admin/OrderNotifier'
import AdminSidebar, { type NavItem } from '@/components/admin/AdminSidebar'

const NAV: NavItem[] = [
  { href: '/admin',           label: 'Dashboard',   icon: '📊' },
  { href: '/admin/orders',    label: 'Orders',       icon: '📦' },
  { href: '/admin/menu',      label: 'Menu',         icon: '🍛' },
  { href: '/admin/areas',     label: 'Areas',        icon: '📍' },
  { href: '/admin/banner',    label: 'Banner',       icon: '🎯' },
  { href: '/admin/promos',    label: 'Promo Codes',  icon: '🏷️' },
  { href: '/admin/customers', label: 'Customers',    icon: '👥' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAuth = !!cookieStore.get(SESSION_COOKIE)?.value

  // Login page — no sidebar
  if (!isAuth) return <>{children}</>

  return (
    <div className="min-h-screen bg-brand-dark md:flex">
      <AdminSidebar nav={NAV} />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
      <OrderNotifier />
    </div>
  )
}
