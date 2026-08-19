import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '@/firebase/firestore'
import { ArrowRight, Phone, MapPin, MessageSquare } from 'lucide-react'
import { formatPhoneForWhatsApp } from '@/lib/helpers'
import type { Order } from '@/types'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getOrder('abu-qir-demo', id).then(data => {
      setOrder(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return <div className="text-center py-12 text-gray-500">الطلب غير موجود</div>
  }

  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(order.phone)}?text=مرحباً ${order.customerName}، شكراً لطلبك.`

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/orders" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h3 className="font-bold text-gray-900">طلب #{order.id.slice(-6)}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h4 className="font-bold text-gray-900">معلومات العميل</h4>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          {order.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400" />
          {order.address}
        </div>
        {order.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
            {order.notes}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h4 className="font-bold text-gray-900">المنتجات</h4>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toFixed(0)} جنيه</p>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-gray-200 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>المجموع الفرعي</span>
            <span>{order.subtotal.toFixed(0)} جنيه</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>رسوم التوصيل</span>
            <span>{order.deliveryFee.toFixed(0)} جنيه</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-1">
            <span>الإجمالي</span>
            <span>{order.total.toFixed(0)} جنيه</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          تواصل عبر واتساب
        </a>
      </div>
    </div>
  )
}
