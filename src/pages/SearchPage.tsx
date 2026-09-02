import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Header from '@/components/storefront/Header'
import { ProductCard } from '@/components/storefront/ProductCard'
import Footer from '@/components/storefront/Footer'
import CartButton from '@/components/storefront/CartButton'
import { useStore } from '@/features/store/StoreContext'
import { useSearchProducts } from '@/features/products/useProducts'
import { LoadingState, EmptyState } from '@/components/ui'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { storeId, loading: storeLoading, store } = useStore()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const { products, loading } = useSearchProducts(storeId, query)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q !== query) setQuery(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 pt-4">
          <LoadingState count={6} />
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-surface-elevated border border-gray-200 rounded-full shadow-sm">
              <button
                type="submit"
                className="p-3 text-gray-400 hover:text-primary transition"
                aria-label="بحث"
              >
                <Search size={20} />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتجات..."
                className="w-full py-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
                dir="rtl"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setSearchParams({})
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

        <div className="max-w-7xl mx-auto px-4 mt-6">
          {query.trim() ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {loading ? 'جاري البحث...' : `نتائج البحث عن "${query}" (${products.length})`}
              </p>

              {loading ? (
                <LoadingState count={6} />
              ) : products.length === 0 ? (
                <EmptyState
                  title="لا توجد نتائج"
                  description={`لم يتم العثور على منتجات مطابقة لـ "${query}"`}
                  actionLabel="مسح البحث"
                  onAction={() => setQuery('')}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="ابحث عن منتجات"
              description="اكتب اسم المنتج في مربع البحث أعلاه"
            />
          )}
        </div>
      </main>

      <Footer />
      <CartButton />
    </div>
  )
}
