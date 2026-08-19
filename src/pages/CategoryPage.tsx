import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/features/store/StoreContext'
import { useProducts } from '@/features/products/useProducts'
import { useCategories } from '@/features/categories/useCategories'
import { ProductCard } from '@/components/storefront/ProductCard'
import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import CartButton from '@/components/storefront/CartButton'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui'

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { storeId } = useStore()
  const { products, loading, error } = useProducts(storeId, id)
  const { categories } = useCategories(storeId)
  const category = categories.find(c => c.id === id)

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

          {category && (
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
          )}

          {loading ? (
            <LoadingState count={6} />
          ) : error ? (
            <ErrorState title="فشل تحميل المنتجات" message={error} />
          ) : products.length === 0 ? (
            <EmptyState title="لا توجد منتجات" description="لا توجد منتجات في هذا القسم حالياً" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartButton />
    </div>
  )
}
