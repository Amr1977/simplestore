import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Trash2 } from 'lucide-react'
import { useCart } from '@/features/cart/CartContext'
import { useStore } from '@/features/store/StoreContext'
import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import { QuantityControl } from '@/components/storefront/QuantityControl'
import { LoadingState, EmptyState } from '@/components/ui'
import { formatPrice } from '@/lib/helpers'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeFromCart, getCartTotal, loading: cartLoading } = useCart()
  const { store, loading: storeLoading } = useStore()
  const subtotal = getCartTotal()

  if (cartLoading || storeLoading || !store) {
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

  const s = store

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <h1 className="text-xl font-bold text-gray-900 mb-6">سلة المشتريات</h1>

          {items.length === 0 ? (
            <EmptyState
              title="السلة فارغة"
              description="أضف منتجات إلى السلة للمتابعة"
              actionLabel="تصفح المنتجات"
              onAction={() => navigate('/')}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {items.map(item => (
                  <div
                    key={item.productId}
                    className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3"
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{item.unit}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition shrink-0"
                          aria-label="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                        <QuantityControl
                          quantity={item.quantity}
                          onUpdate={(q) => updateQuantity(item.productId, q)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
                  <h3 className="font-semibold text-gray-900 mb-3">ملخص الطلب</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {s.delivery.enabled && (
                      <div className="flex justify-between text-gray-600">
                        <span>رسوم التوصيل</span>
                        <span>
                           {s.delivery.freeDeliveryThreshold && subtotal >= s.delivery.freeDeliveryThreshold
                            ? 'مجاني'
                            : formatPrice(s.delivery.fee)}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                      <span>الإجمالي</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition"
                  >
                    إتمام الطلب
                  </Link>

                  <Link
                    to="/"
                    className="mt-2 w-full inline-flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-primary transition"
                  >
                    <ArrowRight size={16} />
                    <span>متابعة التسوق</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
