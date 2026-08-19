import { useState, useEffect } from 'react'
import { getProducts, getOrders } from '@/firebase/firestore'
import { Package, ShoppingBag, AlertCircle } from 'lucide-react'
import type { Product, Order } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState({ newOrders: 0, totalProducts: 0, unavailableProducts: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [products, orders]: [Product[], Order[]] = await Promise.all([
          getProducts('abu-qir-demo'),
          getOrders('abu-qir-demo'),
        ])
        const newOrders = orders.filter(o => o.status === 'new').length
        setStats({
          newOrders,
          totalProducts: products.length,
          unavailableProducts: products.filter(p => !p.available).length,
        })
        setRecentOrders(orders.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">طلبات جديدة</p>
            <p className="text-2xl font-bold text-gray-900">{stats.newOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">المنتجات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">غير متوفر</p>
            <p className="text-2xl font-bold text-gray-900">{stats.unavailableProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4">الطلبات الأخيرة</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد طلبات بعد</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">{order.total.toFixed(0)} جنيه</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'new' ? 'جديد' : order.status === 'confirmed' ? 'مؤكد' : order.status === 'delivered' ? 'تم التوصيل' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
