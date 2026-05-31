import { supabase } from '@/lib/supabase'
import type { DBOrder } from '@/lib/supabase'
import { updateOrderStatus } from '../actions'
import { AREAS } from '@/data/products'

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'on-the-way', 'delivered', 'cancelled']

const statusColor = (s: string) => {
  if (s === 'pending')    return 'bg-yellow-500/20 text-yellow-400'
  if (s === 'confirmed')  return 'bg-blue-500/20 text-blue-400'
  if (s === 'preparing')  return 'bg-orange-500/20 text-orange-400'
  if (s === 'on-the-way') return 'bg-purple-500/20 text-purple-400'
  if (s === 'delivered')  return 'bg-green-500/20 text-green-400'
  if (s === 'cancelled')  return 'bg-red-500/20 text-red-400'
  return 'bg-white/10 text-brand-cream/50'
}

export default async function OrdersPage({ searchParams }: { searchParams: { area?: string; status?: string } }) {
  let query = supabase.from('orders').select('*').order('placed_at', { ascending: false })
  if (searchParams.area)   query = query.eq("delivery->>'area'", searchParams.area)
  if (searchParams.status) query = query.eq('status', searchParams.status)

  const { data } = await query.limit(100)
  const orders: DBOrder[] = data ?? []

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-cream">Orders</h1>
          <p className="text-brand-cream/40 text-sm">{orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <a href="/admin/orders" className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${!searchParams.area && !searchParams.status ? 'bg-brand-yellow text-brand-dark border-brand-yellow' : 'border-white/10 text-brand-cream/60 hover:border-brand-yellow/40'}`}>
          All
        </a>
        {AREAS.map(a => (
          <a key={a.id} href={`/admin/orders?area=${a.id}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${searchParams.area === a.id ? 'bg-brand-yellow text-brand-dark border-brand-yellow' : 'border-white/10 text-brand-cream/60 hover:border-brand-yellow/40'}`}>
            {a.emoji} {a.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-brand-cream/30">No orders found</div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map(order => (
              <div key={order.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-bold text-brand-yellow">{order.order_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-brand-cream font-medium">{order.delivery.name}</p>
                    <p className="text-brand-cream/50 text-sm">{order.delivery.phone} · {AREAS.find(a => a.id === order.delivery.area)?.label ?? order.delivery.area}</p>
                    <p className="text-brand-cream/40 text-sm">{order.delivery.address}</p>
                  </div>

                  <div className="space-y-2 text-right">
                    <p className="text-brand-yellow font-bold text-lg">৳{order.total}</p>
                    <p className="text-brand-cream/40 text-xs">{new Date(order.placed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    <form action={updateOrderStatus.bind(null, order.id, '')}>
                      <select
                        name="status"
                        defaultValue={order.status}
                        onChange={() => {}}
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-brand-cream focus:outline-none focus:border-brand-yellow/60"
                        onBlur={undefined}
                      />
                    </form>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.items.map((item: { id: string; name: string; quantity: number; price: number }) => (
                    <span key={item.id} className="bg-white/5 text-brand-cream/60 text-xs px-2.5 py-1 rounded-full border border-white/8">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                  {order.promo_code && (
                    <span className="bg-brand-yellow/10 text-brand-yellow text-xs px-2.5 py-1 rounded-full border border-brand-yellow/20">
                      🏷️ {order.promo_code}
                    </span>
                  )}
                </div>

                {/* Status update form */}
                <form className="mt-3 flex items-center gap-2" action={async (fd: FormData) => {
                  'use server'
                  const { updateOrderStatus: update } = await import('../actions')
                  await update(order.id, fd.get('status') as string)
                }}>
                  <select name="status" defaultValue={order.status}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-brand-cream focus:outline-none focus:border-brand-yellow/60">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-brand-dark">{s}</option>)}
                  </select>
                  <button type="submit" className="bg-brand-yellow text-brand-dark text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brand-gold transition-colors">
                    Update
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
