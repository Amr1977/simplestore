import { useState, useEffect } from 'react'
import { subscribeToOrders } from '@/firebase/firestore'
import type { Order } from '@/types'
import OrderCard from '@/components/admin/OrderCard'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const unsub = subscribeToOrders('abu-qir-demo', data => {
      setOrders(data)
    })
    return unsub
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'new', label: 'جديد' },
          { key: 'contacted', label: 'تم التواصل' },
          { key: 'confirmed', label: 'مؤكد' },
          { key: 'delivered', label: 'تم التوصيل' },
          { key: 'cancelled', label: 'ملغي' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد طلبات</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
