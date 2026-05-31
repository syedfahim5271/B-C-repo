import { supabase } from '@/lib/supabase'
import type { DBOrder } from '@/lib/supabase'
import Link from 'next/link'

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
      <p className="text-brand-cream/50 text-sm font-medium">{label}</p>
      <p className={`font-display font-bold text-3xl mt-1 ${color ?? 'text-brand-cream'}`}>{value}</p>
      {sub && <p className="text-brand-cream/30 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default async function AdminDashboard() {
  const [ordersRes] = await Promise.all([
    supabase.from('orders').select('*').order('placed_at', { ascending: false }).limit(200),
  ])

  const orders: DBOrder[] = ordersRes.data ?? []

  const today = new Date().toDateString()
  const todayOrders  = orders.filter(o => new Date(o.placed_at).toDateString() === today)
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const pending      = orders.filter(o => o.status === 'pending').length

  // Top dishes
  const dishCount: Record<string, { name: string; count: number }> = {}
  orders.forEach(order => {
    order.items.forEach((item: { id: string; name: string; quantity: number }) => {
      if (!dishCount[item.id]) dishCount[item.id] = { name: item.name, count: 0 }
      dishCount[item.id].count += item.quantity
    })
  })
  const topDishes = Object.values(dishCount).sort((a, b) => b.count - a.count).slice(0, 4)

  const recent = orders.slice(0, 8)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Dashboard</h1>
        <p className="text-brand-cream/40 text-sm mt-0.5">Welcome back 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders"    value={orders.length}     sub="all time" />
        <StatCard label="Today's Orders"  value={todayOrders.length} sub={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} color="text-brand-yellow" />
        <StatCard label="Today's Revenue" value={`৳${todayRevenue}`} sub="incl. delivery" color="text-brand-yellow" />
        <StatCard label="Pending"         value={pending}            sub="need action" color={pending > 0 ? 'text-brand-red' : 'text-brand-cream'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top dishes */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
          <h2 className="font-display font-bold text-brand-cream mb-4">Top Dishes</h2>
          {topDishes.length === 0 ? (
            <p className="text-brand-cream/30 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {topDishes.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-6 text-center text-brand-cream/30 text-sm font-bold">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-cream/80 font-medium">{d.name}</span>
                      <span className="text-brand-yellow font-bold">{d.count} sold</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-yellow rounded-full"
                        style={{ width: `${Math.min(100, (d.count / (topDishes[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-brand-cream">Recent Orders</h2>
            <Link href="/admin/orders" className="text-brand-yellow text-xs hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-brand-cream/30 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {recent.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-brand-cream/80 text-sm font-medium">{order.delivery.name}</p>
                    <p className="text-brand-cream/30 text-xs">{order.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-yellow text-sm font-bold">৳{order.total}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'pending'   ? 'bg-yellow-500/20 text-yellow-400' :
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400'  :
                      'bg-white/10 text-brand-cream/50'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue summary */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/8">
        <h2 className="font-display font-bold text-brand-cream mb-2">All-time Revenue</h2>
        <p className="font-display font-extrabold text-4xl text-brand-yellow">৳{totalRevenue.toLocaleString()}</p>
        <p className="text-brand-cream/30 text-sm mt-1">from {orders.length} orders</p>
      </div>
    </div>
  )
}
