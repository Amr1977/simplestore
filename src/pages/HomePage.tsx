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

function SectionHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border-strong/40 pb-4">
      <div className="flex items-baseline gap-4">
        <span
          className="font-display text-accent/70 text-3xl md:text-4xl font-bold leading-none tabular-nums"
          aria-hidden="true"
        >
          {number}
        </span>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            {title}
          </h2>
          <p className="text-sm text-muted mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { store, storeId, loading: storeLoading } = useStore()
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

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <div className="h-12 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="h-6 bg-gray-100 rounded w-32 animate-pulse mb-3" />
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-20">
                  <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse mb-2 mx-auto" />
                  <div className="h-3 bg-gray-100 rounded w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="h-6 bg-gray-100 rounded w-32 animate-pulse mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-elevated rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-5 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">المتجر غير متاح حالياً</h2>
            <p className="text-sm text-gray-500 mb-6">نعتذر عن الإزعاج، يرجى المحاولة لاحقاً</p>
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
        <StoreBanner store={store} />

        <div className="max-w-7xl mx-auto px-4 mt-6">
          <form onSubmit={handleSearch} className="relative">
            <div
              className={`flex items-center bg-surface-elevated border transition-all duration-200 ${
                isSearchFocused
                  ? 'border-primary shadow-[0_2px_0_0_var(--color-primary)]'
                  : 'border-border'
              }`}
            >
              <button
                type="submit"
                className="p-3 text-muted hover:text-primary transition"
                aria-label="بحث"
              >
                <Search size={20} strokeWidth={2} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="ابحث عن منتجات..."
                className="w-full py-3 text-[15px] bg-transparent outline-none placeholder:text-muted text-ink"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchFocused(false)
                  }}
                  className="p-3 text-muted hover:text-ink transition"
                  aria-label="مسح"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {categories.length > 0 && (
          <section className="mt-10 md:mt-12">
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeading number="٠٠" title="تصفح حسب القسم" subtitle="اعثر على ما تحتاجه" />
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-5">
              {categoriesLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-20 animate-pulse">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-border/40 mb-2 mx-auto" />
                      <div className="h-3 bg-border/50 w-12 mx-auto" />
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

        <section className="mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <SectionHeading number="01" title="منتجات مميزة" subtitle="مختارة بعناية لك" />
          </div>
          <div className="max-w-7xl mx-auto px-4">
            {featuredLoading ? (
              <LoadingState count={4} />
            ) : featuredError ? (
              <EmptyState title="فشل تحميل المنتجات" description={featuredError} />
            ) : featured.length === 0 ? (
              <EmptyState title="لا توجد منتجات مميزة" description="تابعنا لاحقاً لمعرفة المنتجات الجديدة" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {featured.map((product, idx) => (
                  <div
                    key={product.id}
                    className={
                      idx === 0 && featured.length > 1
                        ? 'col-span-2 lg:col-span-2 lg:row-span-2'
                        : ''
                    }
                  >
                    <ProductCard
                      product={product}
                      variant={idx === 0 && featured.length > 1 ? 'hero' : 'default'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-12 md:mt-16 mb-12 md:mb-16">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <SectionHeading number="02" title="الأكثر طلباً" subtitle="ما يفضله عملاؤنا" />
          </div>
          <div className="max-w-7xl mx-auto px-4">
            {popularLoading ? (
              <LoadingState count={4} />
            ) : popularError ? (
              <EmptyState title="فشل تحميل المنتجات" description={popularError} />
            ) : popular.length === 0 ? (
              <EmptyState title="لا توجد منتجات شائعة" description="تابعنا لاحقاً" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
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
