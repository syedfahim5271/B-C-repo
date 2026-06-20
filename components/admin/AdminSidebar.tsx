'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: string
}

const COLLAPSE_KEY = 'bc-admin-sidebar-collapsed'

export default function AdminSidebar({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Restore desktop collapse preference
  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1')
  }, [])

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      return next
    })
  }

  // Close the mobile drawer whenever the route changes
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const NavLinks = ({ showLabels }: { showLabels: boolean }) => (
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto no-scrollbar">
      {nav.map(item => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            title={!showLabels ? item.label : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-tap ${
              showLabels ? '' : 'justify-center'
            } ${
              active
                ? 'bg-brand-yellow/15 text-brand-yellow'
                : 'text-brand-cream/60 hover:text-brand-cream hover:bg-white/5'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {showLabels && <span className="truncate">{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  const LogoutButton = ({ showLabels }: { showLabels: boolean }) => (
    <form method="POST" action="/api/admin/logout">
      <button
        type="submit"
        title={!showLabels ? 'Logout' : undefined}
        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-cream/40 hover:text-brand-red hover:bg-white/5 transition-colors min-tap ${
          showLabels ? '' : 'justify-center'
        }`}
      >
        <LogOut size={16} />
        {showLabels && 'Logout'}
      </button>
    </form>
  )

  return (
    <>
      {/* ---------- Mobile top bar ---------- */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-brand-darker/95 backdrop-blur border-b border-white/5 px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="min-tap flex items-center justify-center -ml-2 text-brand-cream/80 hover:text-brand-cream"
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="font-display font-bold text-brand-yellow text-sm leading-tight">B&amp;C Admin</p>
          <p className="text-brand-cream/30 text-[11px] leading-tight">Biryani &amp; Chill</p>
        </div>
      </header>

      {/* ---------- Mobile drawer + backdrop ---------- */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 max-w-[80%] bg-brand-darker border-r border-white/10 flex flex-col shadow-2xl animate-[slidein_.2s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <p className="font-display font-bold text-brand-yellow text-base">B&amp;C Admin</p>
                <p className="text-brand-cream/30 text-xs mt-0.5">Biryani &amp; Chill</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="min-tap flex items-center justify-center text-brand-cream/60 hover:text-brand-cream"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks showLabels />
            <div className="p-3 border-t border-white/5">
              <LogoutButton showLabels />
            </div>
          </aside>
        </div>
      )}

      {/* ---------- Desktop sidebar ---------- */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-brand-darker border-r border-white/5 transition-[width] duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className={`flex items-center border-b border-white/5 p-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-brand-yellow text-base truncate">B&amp;C Admin</p>
              <p className="text-brand-cream/30 text-xs mt-0.5 truncate">Biryani &amp; Chill</p>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex items-center justify-center text-brand-cream/40 hover:text-brand-cream transition-colors"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <NavLinks showLabels={!collapsed} />

        <div className="p-3 border-t border-white/5">
          <LogoutButton showLabels={!collapsed} />
        </div>
      </aside>
    </>
  )
}
