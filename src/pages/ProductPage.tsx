import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { useStore } from '@/features/store/StoreContext'
import { useProduct, useProducts } from '@/features/products/useProducts'
import { useCart } from '@/features/cart/CartContext'
import ProductGallery from '@/components/storefront/ProductGallery'
import { QuantityControl } from '@/components/storefront/QuantityControl'
import { ProductCard } from '@/components/storefront/ProductCard'
import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import CartButton from '@/components/storefront/CartButton'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui'
import { formatPrice } from '@/lib/helpers'
import type { Product } from '@/types'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { storeId, loading: storeLoading, store } = useStore()
  const { product, loading, error } = useProduct(storeId, id ?? '')
  const { addToCart, items, updateQuantity } = useCart()
  const { products: relatedProducts, loading: relatedLoading } = useProducts(storeId, product?.categoryId)

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 pt-4">
          <LoadingState count={3} />
        </main>
        <Footer />
        <CartButton />
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
        <CartButton />
      </div>
    )
  }

  const cartItem = items.find(item => item.productId === id)
  const quantity = cartItem?.quantity ?? 0

  const handleAddToCart = () => {
    if (!product || !product.available) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      imageUrl: product.media[0]?.secureUrl ?? '',
      available: product.available,
    })
  }

  const related = relatedProducts.filter((p: Product) => p.id !== id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition mb-3"
          >
            <ArrowRight size={18} />
            <span>رجوع</span>
          </button>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-20 bg-gray-100 rounded" />
              </div>
            </div>
          ) : error ? (
            <ErrorState title="فشل تحميل المنتج" message={error} />
          ) : !product ? (
            <EmptyState title="المنتج غير موجود" description="قد يكون هذا المنتج قد تم حذفه" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductGallery media={product.media} productName={product.name} />

              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>
                  {product.unit && (
                    <p className="text-sm text-gray-500 mt-1">الوحدة: {product.unit}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.available ? 'متاح' : 'غير متاح'}
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100">
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between">
                      <QuantityControl
                        quantity={quantity}
                        onUpdate={(q) => updateQuantity(product.id, q)}
                        size="md"
                      />
                      <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition"
                      >
                        <ShoppingCart size={18} />
                        <span>إلى السلة</span>
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!product.available}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                    >
                      <ShoppingCart size={18} />
                      <span>أضف للسلة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <section className="mt-12 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">منتجات مشابهة</h2>
              {relatedLoading ? (
                <LoadingState count={4} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {related.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
      <CartButton />
    </div>
  )
}
