import { supabase } from '@/lib/supabase'
import type { DBOrder } from '@/lib/supabase'
import OrderCard from '@/components/admin/OrderCard'
export const dynamic = 'force-dynamic'

const STATUS_TABS = [
  { value: '',           label: 'All'        },
  { value: 'pending',    label: '🟡 Pending'  },
  { value: 'confirmed',  label: '🔵 Confirmed'},
  { value: 'preparing',  label: '🟠 Preparing'},
  { value: 'on-the-way', label: '🟣 On Way'   },
  { value: 'delivered',  label: '🟢 Delivered'},
  { value: 'cancelled',  label: '🔴 Cancelled'},
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { area?: string; status?: string }
}) {
  let query = supabase.from('orders').select('*').order('placed_at', { ascending: false })
  if (searchParams.status) query = query.eq('status', searchParams.status)

  const { data } = await query.limit(100)
  const orders: DBOrder[] = data ?? []

  // Area filter applied client-side to avoid Supabase jsonb query issues
  const filtered = searchParams.area
    ? orders.filter(o => o.delivery?.area === searchParams.area)
    : orders

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Orders</h1>
        <p className="text-brand-cream/40 text-sm mt-0.5">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {STATUS_TABS.map(tab => (
          <a
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              (searchParams.status ?? '') === tab.value
                ? 'bg-brand-yellow text-brand-dark border-brand-yellow'
                : 'border-white/10 text-brand-cream/60 hover:border-brand-yellow/40'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-brand-cream/30">No orders yet</p>
          <p className="text-brand-cream/20 text-sm mt-1">Orders will appear here when customers check out</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
