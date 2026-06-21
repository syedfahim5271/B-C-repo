import { supabase } from '@/lib/supabase'
import type { DBOrder, DBUser, DBReward } from '@/lib/supabase'
import { AREAS } from '@/data/products'
export const dynamic = 'force-dynamic'

interface Customer {
  id: string            // user id, or `guest:<phone>`
  registered: boolean
  name: string
  phone: string
  email: string | null
  area: string
  referralCode: string | null
  referralsMade: number // how many people ordered with their code
  rewardsUnused: number
  orderCount: number
  totalSpent: number
  lastOrder: string | null
}

export default async function CustomersPage() {
  const [usersRes, ordersRes, rewardsRes] = await Promise.all([
    supabase.from('users').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*').order('placed_at', { ascending: false }),
    supabase.from('rewards').select('*'),
  ])
  const users: DBUser[] = usersRes.data ?? []
  const orders: DBOrder[] = ordersRes.data ?? []
  const rewards: DBReward[] = rewardsRes.data ?? []

  // Registered customers, keyed by user id.
  const byId = new Map<string, Customer>()
  const byPhone = new Map<string, Customer>()
  for (const u of users) {
    const c: Customer = {
      id: u.id,
      registered: true,
      name: u.name ?? 'Unnamed',
      phone: u.phone ?? '',
      email: u.email,
      area: u.area ?? '',
      referralCode: u.referral_code,
      referralsMade: rewards.filter(r => r.referrer_id === u.id).length,
      rewardsUnused: rewards.filter(r => r.referrer_id === u.id && !r.is_used).length,
      orderCount: 0,
      totalSpent: 0,
      lastOrder: null,
    }
    byId.set(u.id, c)
    if (u.phone) byPhone.set(u.phone, c)
  }

  // Attribute every order to a registered user (by user_id, else phone) or a guest.
  for (const o of orders) {
    let c: Customer | undefined =
      (o.user_id && byId.get(o.user_id)) || byPhone.get(o.delivery?.phone)
    if (!c) {
      const phone = o.delivery?.phone ?? 'unknown'
      const key = `guest:${phone}`
      c = byId.get(key)
      if (!c) {
        c = {
          id: key, registered: false, name: o.delivery?.name ?? 'Guest', phone,
          email: null, area: o.delivery?.area ?? '', referralCode: null,
          referralsMade: 0, rewardsUnused: 0, orderCount: 0, totalSpent: 0, lastOrder: null,
        }
        byId.set(key, c)
      }
    }
    c.orderCount++
    c.totalSpent += o.total
    if (!c.lastOrder || o.placed_at > c.lastOrder) c.lastOrder = o.placed_at
    if (!c.area) c.area = o.delivery?.area ?? ''
  }

  const customers = Array.from(byId.values()).sort((a, b) => {
    if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent
    return Number(b.registered) - Number(a.registered)
  })

  const registeredCount = customers.filter(c => c.registered).length
  const totalReferrals = rewards.length
  const areaLabel = (id: string) => AREAS.find(a => a.id === id)?.label ?? id ?? '—'
  const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—')

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Customers</h1>
        <p className="text-brand-cream/40 text-sm">
          {customers.length} total · {registeredCount} registered · {totalReferrals} referral{totalReferrals !== 1 ? 's' : ''}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white/5 rounded-2xl border border-white/8 py-16 text-center text-brand-cream/30">
          No customers yet
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => (
            <div key={c.id} className="bg-white/5 rounded-2xl border border-white/8 p-4 hover:bg-white/[0.07] transition-colors" data-testid={`customer-${c.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-brand-cream truncate">{c.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.registered ? 'bg-brand-yellow/15 text-brand-yellow' : 'bg-white/10 text-brand-cream/40'}`}>
                      {c.registered ? 'Registered' : 'Guest'}
                    </span>
                  </div>
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="text-brand-cream/50 text-sm hover:text-brand-yellow transition-colors">{c.phone}</a>
                  )}
                  {c.email && <p className="text-brand-cream/30 text-xs truncate">{c.email}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-brand-yellow text-lg">৳{c.totalSpent}</p>
                  <p className="text-brand-cream/30 text-xs">{c.orderCount} order{c.orderCount !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap mt-3 text-xs">
                <span className="text-brand-cream/50">📍 {areaLabel(c.area)}</span>
                {c.referralCode && (
                  <span className="text-brand-cream/50">
                    🔗 Code <span className="font-display font-bold text-brand-cream tracking-wider">{c.referralCode}</span>
                  </span>
                )}
                {c.registered && (
                  <span className="text-brand-cream/50">🎁 Referred {c.referralsMade}</span>
                )}
                {c.rewardsUnused > 0 && (
                  <span className="bg-green-500/15 text-green-400 font-semibold px-2 py-0.5 rounded-full">{c.rewardsUnused} reward{c.rewardsUnused !== 1 ? 's' : ''} unused</span>
                )}
                <span className="text-brand-cream/30 ml-auto">Last: {fmtDate(c.lastOrder)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
