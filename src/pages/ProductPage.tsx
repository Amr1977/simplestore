import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingCart, Package, Tag } from 'lucide-react'
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
import { useCategories } from '@/features/categories/useCategories'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { storeId, loading: storeLoading, store } = useStore()
  const { product, loading, error } = useProduct(storeId, id ?? '')
  const { addToCart, items, updateQuantity } = useCart()
  const { products: relatedProducts, loading: relatedLoading } = useProducts(storeId, product?.categoryId)
  const { categories } = useCategories(storeId)

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
            <h2 className="text-xl font-bold text-ink mb-2">المتجر غير متاح حالياً</h2>
            <p className="text-sm text-muted">نعتذر عن الإزعاج، يرجى المحاولة لاحقاً</p>
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
  const category = categories.find(c => c.id === product?.categoryId)
  const hasDiscount = product?.oldPrice && product.oldPrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product!.oldPrice! - product!.price) / product!.oldPrice!) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-4 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition mb-3"
          >
            <ArrowRight size={18} />
            <span>رجوع</span>
          </button>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="aspect-square bg-border rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 bg-border rounded w-1/3" />
                <div className="h-8 bg-border rounded w-3/4" />
                <div className="h-6 bg-border rounded w-1/2" />
                <div className="h-20 bg-border rounded" />
              </div>
            </div>
          ) : error ? (
            <ErrorState title="فشل تحميل المنتج" message={error} />
          ) : !product ? (
            <EmptyState title="المنتج غير موجود" description="قد يكون هذا المنتج قد تم حذفه" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="md:sticky md:top-20 md:self-start">
                <ProductGallery media={product.media} productName={product.name} />
              </div>

              <div className="flex flex-col">
                {category && (
                  <Link
                    to={`/category/${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-soft transition mb-3 self-start"
                  >
                    <Tag size={12} />
                    <span>{category.name}</span>
                  </Link>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums" dir="ltr">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-muted">جنيه</span>
                  </div>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-muted line-through tabular-nums" dir="ltr">
                        {formatPrice(product.oldPrice!)}
                      </span>
                      <span className="inline-flex items-center bg-accent text-ink text-xs font-bold px-2 py-1 tabular-nums">
                        −{discountPct}٪
                      </span>
                    </>
                  )}
                </div>

                {product.unit && (
                  <p className="text-sm text-muted mt-2 inline-flex items-center gap-1.5">
                    <Package size={14} className="shrink-0" />
                    <span>الوحدة: {product.unit}</span>
                  </p>
                )}

                <div className="my-5 h-px bg-border" />

                {product.description && (
                  <p className="text-sm sm:text-base text-ink-soft leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}

                <div className="mt-5 flex items-center gap-2">
                  {product.available ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                      <span>متاح للتوصيل</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                      <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
                      <span>غير متوفر حالياً</span>
                    </span>
                  )}
                </div>

                <div className="hidden md:block mt-6 pt-6 border-t border-border">
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between gap-3">
                      <QuantityControl
                        quantity={quantity}
                        onUpdate={(q) => updateQuantity(product.id, q)}
                        size="md"
                      />
                      <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 bg-primary text-surface-elevated px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary-soft transition"
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
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-surface-elevated px-6 py-4 rounded-full text-base font-bold hover:bg-primary-soft disabled:bg-border disabled:text-muted disabled:cursor-not-allowed transition shadow-sm"
                    >
                      <ShoppingCart size={20} />
                      <span>{product.available ? 'أضف للسلة' : 'غير متوفر'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <section className="mt-12 md:mt-16 mb-8">
              <h2 className="text-lg font-bold text-ink mb-4">منتجات مشابهة</h2>
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

      {product && product.available && quantity === 0 && (
        <div className="md:hidden sticky bottom-0 inset-x-0 z-30 bg-surface-elevated/95 backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-surface-elevated px-6 py-4 rounded-full text-base font-bold hover:bg-primary-soft transition shadow-sm"
          >
            <ShoppingCart size={20} />
            <span>أضف للسلة • {formatPrice(product.price)} جنيه</span>
          </button>
        </div>
      )}

      {product && product.available && quantity > 0 && (
        <div className="md:hidden sticky bottom-0 inset-x-0 z-30 bg-surface-elevated/95 backdrop-blur-md border-t border-border p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <QuantityControl
              quantity={quantity}
              onUpdate={(q) => updateQuantity(product.id, q)}
              size="md"
            />
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 bg-primary text-surface-elevated px-5 py-3 rounded-full text-sm font-semibold flex-1 justify-center"
            >
              <ShoppingCart size={18} />
              <span>إلى السلة</span>
            </Link>
          </div>
        </div>
      )}

      <Footer />
      <CartButton />
    </div>
  )
}
