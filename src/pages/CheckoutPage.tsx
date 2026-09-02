import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/features/cart/CartContext'
import { useStore } from '@/features/store/StoreContext'
import { createOrder } from '@/firebase/firestore'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'
import { formatPhoneForWhatsApp, validateEgyptianPhone } from '@/lib/helpers'
import { formatPrice } from '@/lib/helpers'
import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import { LoadingState } from '@/components/ui'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const { store } = useStore()
  const { loading: storeLoading } = useStore()
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!storeLoading && items.length === 0 && !submitted) {
      navigate('/cart')
    }
  }, [items.length, navigate, submitted, storeLoading])

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <LoadingState count={3} />
        </main>
        <Footer />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">المتجر غير متاح حالياً</h2>
            <p className="text-sm text-gray-500">نعتذر عن الإزعاج، يرجى المحاولة لاحقاً</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const s = store
  const subtotal = getCartTotal()
  const deliveryFee = s.delivery.enabled
    ? (s.delivery.freeDeliveryThreshold && subtotal >= s.delivery.freeDeliveryThreshold
      ? 0
      : s.delivery.fee)
    : 0
  const total = subtotal + deliveryFee

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'يرجى إدخال الاسم'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف'
    } else if (!validateEgyptianPhone(formData.phone)) {
      newErrors.phone = 'يرجى إدخال رقم هاتف مصري صحيح'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'يرجى إدخال العنوان'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSubmitting(true)

    try {
      const order = {
        storeId: s.id,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: 'الدفع عند الاستلام',
        status: 'new',
      }

      await createOrder(s.id, order)

      const message = generateWhatsAppMessage({
        storeName: s.name,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod: 'الدفع عند الاستلام',
        notes: formData.notes.trim(),
        whatsappNumber: s.whatsappNumber,
      })

      openWhatsApp(formatPhoneForWhatsApp(s.whatsappNumber), message)
      clearCart()
      setSubmitted(true)
    } catch (error) {
      console.error('Order creation failed:', error)
      setErrors({ submit: 'فشل إرسال الطلب، يرجى المحاولة مرة أخرى' })
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !submitted) {
    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h2>
            <p className="text-sm text-gray-500 mb-6">سيتم التواصل معك قريباً لتأكيد الطلب</p>
            <Link to="/" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              <ArrowRight size={18} />
              <span>العودة للمتجر</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition mb-4"
          >
            <ArrowRight size={18} />
            <span>رجوع للسلة</span>
          </button>

          <h1 className="text-xl font-bold text-gray-900 mb-6">إتمام الطلب</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-surface-elevated border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">معلومات العميل</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">الاسم *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
                      placeholder="الاسم الكامل"
                      dir="rtl"
                    />
                    {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">العنوان *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
                      placeholder="العنوان بالتفصيل"
                      dir="rtl"
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ملاحظات</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary text-sm outline-none transition resize-none"
                      placeholder="ملاحظات إضافية (اختياري)"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface-elevated border border-gray-200 rounded-xl p-4 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-3">ملخص الطلب</h3>

                <div className="space-y-2 text-sm mb-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-gray-600">
                      <span className="truncate ml-2">{item.name} × {item.quantity}</span>
                      <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-2 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>التوصيل</span>
                    <span>{deliveryFee === 0 ? 'مجاني' : formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>الإجمالي</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-xs text-red-500 mt-2">{errors.submit}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{submitting ? 'جاري الإرسال...' : 'إرسال الطلب عبر واتساب'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}