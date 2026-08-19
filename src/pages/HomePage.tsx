import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/storefront/Header'
import StoreBanner from '@/components/storefront/StoreBanner'
import CategoryCard from '@/components/storefront/CategoryCard'
import { ProductCard } from '@/components/storefront/ProductCard'
import Footer from '@/components/storefront/Footer'
import CartButton from '@/components/storefront/CartButton'
import { useStore } from '@/features/store/StoreContext'
import { useCategories } from '@/features/categories/useCategories'
import { useFeaturedProducts, usePopularProducts } from '@/features/products/useProducts'
import { LoadingState, EmptyState } from '@/components/ui'

export default function HomePage() {
  const { store } = useStore()
  const s = store!
  const { storeId } = useStore()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(storeId)
  const { products: featured, loading: featuredLoading, error: featuredError } = useFeaturedProducts(storeId)
  const { products: popular, loading: popularLoading, error: popularError } = usePopularProducts(storeId)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }, [searchQuery, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <StoreBanner store={s} />

        <div className="max-w-7xl mx-auto px-4 mt-4">
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center bg-white border rounded-full transition-all duration-200 ${isSearchFocused ? 'border-primary shadow-sm' : 'border-gray-200'}`}>
              <button
                type="submit"
                className="p-3 text-gray-400 hover:text-primary transition"
                aria-label="بحث"
              >
                <Search size={20} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="ابحث عن منتجات..."
                className="w-full py-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchFocused(false)
                  }}
                  className="p-3 text-gray-400 hover:text-gray-600 transition"
                  aria-label="مسح"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {categories.length > 0 && (
          <section className="mt-6">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">الأقسام</h2>
            </div>
            <div className="max-w-7xl mx-auto px-4">
              {categoriesLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-20 animate-pulse">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-2 mx-auto" />
                      <div className="h-3 bg-gray-100 rounded w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : categoriesError ? (
                <EmptyState title="فشل تحميل الأقسام" description={categoriesError} />
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(category => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="max-w-7xl mx-auto px-4 mb-3">
            <h2 className="text-lg font-bold text-gray-900">منتجات مميزة</h2>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            {featuredLoading ? (
              <LoadingState count={4} />
            ) : featuredError ? (
              <EmptyState title="فشل تحميل المنتجات" description={featuredError} />
            ) : featured.length === 0 ? (
              <EmptyState title="لا توجد منتجات مميزة" description="تابعنا لاحقاً لمعرفة المنتجات الجديدة" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 mb-3">
            <h2 className="text-lg font-bold text-gray-900">الأكثر طلباً</h2>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            {popularLoading ? (
              <LoadingState count={4} />
            ) : popularError ? (
              <EmptyState title="فشل تحميل المنتجات" description={popularError} />
            ) : popular.length === 0 ? (
              <EmptyState title="لا توجد منتجات شائعة" description="تابعنا لاحقاً" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {popular.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <CartButton />
    </div>
  )
}
