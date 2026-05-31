import { supabase } from '@/lib/supabase'
import type { DBOrder } from '@/lib/supabase'
import { AREAS } from '@/data/products'
export const dynamic = 'force-dynamic'


export default async function CustomersPage() {
  const { data } = await supabase.from('orders').select('*').order('placed_at', { ascending: false })
  const orders: DBOrder[] = data ?? []

  // Deduplicate by phone number, keeping latest order info
  const customerMap: Record<string, {
    name: string; phone: string; area: string
    orderCount: number; totalSpent: number; lastOrder: string
  }> = {}

  orders.forEach(o => {
    const phone = o.delivery.phone
    if (!customerMap[phone]) {
      customerMap[phone] = { name: o.delivery.name, phone, area: o.delivery.area, orderCount: 0, totalSpent: 0, lastOrder: o.placed_at }
    }
    customerMap[phone].orderCount++
    customerMap[phone].totalSpent += o.total
    if (o.placed_at > customerMap[phone].lastOrder) customerMap[phone].lastOrder = o.placed_at
  })

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-brand-cream">Customers</h1>
        <p className="text-brand-cream/40 text-sm">{customers.length} unique customers</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-16 text-center text-brand-cream/30">No customers yet</div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Header */}
            <div className="grid grid-cols-5 px-5 py-3 text-brand-cream/30 text-xs uppercase tracking-wider font-medium">
              <span className="col-span-2">Customer</span>
              <span>Area</span>
              <span className="text-center">Orders</span>
              <span className="text-right">Total Spent</span>
            </div>
            {customers.map(c => (
              <div key={c.phone} className="grid grid-cols-5 items-center px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="col-span-2">
                  <p className="font-medium text-brand-cream text-sm">{c.name}</p>
                  <a href={`tel:${c.phone}`} className="text-brand-cream/40 text-xs hover:text-brand-yellow transition-colors">{c.phone}</a>
                </div>
                <p className="text-brand-cream/60 text-sm">
                  {AREAS.find(a => a.id === c.area)?.label ?? c.area}
                </p>
                <p className="text-center font-bold text-brand-cream">{c.orderCount}</p>
                <p className="text-right font-bold text-brand-yellow">৳{c.totalSpent}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
