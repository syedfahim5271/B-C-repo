'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { User, Package, LogOut, Gift } from 'lucide-react'

function initials(name?: string | null): string {
  if (!name) return '🙂'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
}

export default function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const user = session?.user
  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Account menu"
        className="min-tap w-9 h-9 rounded-full overflow-hidden bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow text-xs font-bold hover:border-brand-yellow transition-colors"
      >
        {user.image ? (
          <Image src={user.image} alt={user.name ?? 'You'} width={36} height={36} className="object-cover" />
        ) : (
          <span>{initials(user.name)}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-brand-darker border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-brand-cream font-semibold text-sm truncate">{user.name ?? 'Your account'}</p>
            {user.email && <p className="text-brand-cream/40 text-xs truncate">{user.email}</p>}
          </div>
          <div className="p-1.5">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-cream/70 hover:text-brand-cream hover:bg-white/5 transition-colors">
              <User size={16} /> My Profile
            </Link>
            <Link href="/profile#rewards" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-cream/70 hover:text-brand-cream hover:bg-white/5 transition-colors">
              <Gift size={16} /> My Rewards
            </Link>
            <Link href="/orders" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-cream/70 hover:text-brand-cream hover:bg-white/5 transition-colors">
              <Package size={16} /> My Orders
            </Link>
            <button onClick={() => signOut()}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-cream/50 hover:text-brand-red hover:bg-white/5 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
