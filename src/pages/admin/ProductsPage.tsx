import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, getCategories, deleteProduct, updateProduct } from '@/firebase/firestore'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Filter,
  Package,
  ChevronLeft,
  Star,
  TrendingUp,
} from 'lucide-react'
import type { Product, Category } from '@/types'

type StatusFilter = 'all' | 'available' | 'unavailable'
type SortBy = 'newest' | 'oldest' | 'name' | 'price-asc' | 'price-desc' | 'order'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('order')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        getProducts('abu-qir-demo'),
        getCategories('abu-qir-demo'),
      ])
      setProducts(prods as Product[])
      setCategories(cats as Category[])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    setDeletingId(id)
    try {
      await deleteProduct('abu-qir-demo', id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const toggleAvailability = async (product: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, available: !p.available } : p))
    )
    try {
      await updateProduct('abu-qir-demo', product.id, { available: !product.available })
    } catch {
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, available: product.available } : p))
      )
    }
  }

  const filtered = useMemo(() => {
    let list = products
    if (categoryId !== 'all') list = list.filter(p => p.categoryId === categoryId)
    if (status === 'available') list = list.filter(p => p.available)
    if (status === 'unavailable') list = list.filter(p => !p.available)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
    else if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sortBy === 'newest')
      sorted.sort(
        (a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
      )
    else if (sortBy === 'oldest')
      sorted.sort(
        (a, b) => new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()
      )
    else sorted.sort((a, b) => a.sortOrder - b.sortOrder)
    return sorted
  }, [products, search, categoryId, status, sortBy])

  const stats = useMemo(() => {
    const total = products.length
    const available = products.filter(p => p.available).length
    const unavailable = total - available
    const featured = products.filter(p => p.featured).length
    const popular = products.filter(p => p.popular).length
    return { total, available, unavailable, featured, popular }
  }, [products])

  const categoryName = (id: string) => categories.find(c => c.id === id)?.name || '—'
  const hasActiveFilters = categoryId !== 'all' || status !== 'all' || search.trim() !== ''

  const clearFilters = () => {
    setCategoryId('all')
    setStatus('all')
    setSearch('')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">المنتجات</h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {loading ? '...' : `${stats.total} منتج · ${stats.available} متاح`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة منتج</span>
          <span className="sm:hidden">جديد</span>
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <StatTile label="إجمالي" value={stats.total} icon={Package} color="bg-blue-50 text-blue-700" />
        <StatTile label="متاح" value={stats.available} icon={Package} color="bg-green-50 text-green-700" />
        <StatTile label="مميز" value={stats.featured} icon={Star} color="bg-amber-50 text-amber-700" />
        <StatTile label="رائج" value={stats.popular} icon={TrendingUp} color="bg-rose-50 text-rose-700" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في المنتجات..."
              className="w-full pr-10 pl-10 py-2.5 rounded-lg border border-border bg-surface-elevated text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(v => !v)}
            className={`relative inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
              showFilters || hasActiveFilters
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface-elevated text-ink'
            }`}
            aria-label="فلاتر"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">فلاتر</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {(categoryId !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0) + (search ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-surface-elevated border border-border rounded-lg p-3 sm:p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">القسم</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
                <FilterChip active={categoryId === 'all'} onClick={() => setCategoryId('all')}>
                  الكل
                </FilterChip>
                {categories.map(cat => (
                  <FilterChip
                    key={cat.id}
                    active={categoryId === cat.id}
                    onClick={() => setCategoryId(cat.id)}
                  >
                    {cat.name}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">الحالة</label>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'available', 'unavailable'] as StatusFilter[]).map(s => (
                  <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
                    {s === 'all' ? 'الكل' : s === 'available' ? 'متاح' : 'غير متاح'}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">الترتيب</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="order">الترتيب المخصص</option>
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="name">الاسم</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary hover:underline"
              >
                مسح كل الفلاتر
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.categoryId)}
                onEdit={() => navigate(`/admin/products/${product.id}/edit`)}
                onDelete={() => handleDelete(product.id, product.name)}
                onToggleAvailability={() => toggleAvailability(product)}
                deleting={deletingId === product.id}
              />
            ))}
          </ul>

          <div className="hidden md:block bg-surface-elevated border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">المنتج</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">القسم</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">السعر</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">الحالة</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">الترتيب</th>
                    <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide w-32">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(product => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      categoryName={categoryName(product.categoryId)}
                      onEdit={() => navigate(`/admin/products/${product.id}/edit`)}
                      onDelete={() => handleDelete(product.id, product.name)}
                      onToggleAvailability={() => toggleAvailability(product)}
                      deleting={deletingId === product.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatTile({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: any
  color: string
}) {
  return (
    <div className="bg-surface-elevated border border-border rounded-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-ink tabular-nums">{value}</p>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-surface border-border text-ink hover:border-primary/50'
      }`}
    >
      {children}
    </button>
  )
}

function ProductCard({
  product,
  categoryName,
  onEdit,
  onDelete,
  onToggleAvailability,
  deleting,
}: {
  product: Product
  categoryName: string
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
  deleting: boolean
}) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  return (
    <li
      className={`bg-surface-elevated border border-border rounded-xl overflow-hidden transition ${
        deleting ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface">
          {product.media[0] ? (
            <img
              src={product.media[0].thumbnailUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Package className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-ink text-sm leading-snug line-clamp-2">{product.name}</h3>
            <AvailabilityToggle
              available={product.available}
              onChange={onToggleAvailability}
            />
          </div>
          <p className="text-xs text-muted mt-0.5 truncate">{categoryName}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-ink tabular-nums">
              {product.price.toFixed(0)} ج.م
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through tabular-nums">
                {product.oldPrice!.toFixed(0)}
              </span>
            )}
            {product.featured && <BadgeIcon icon={Star} color="text-amber-500" />}
            {product.popular && <BadgeIcon icon={TrendingUp} color="text-rose-500" />}
          </div>
        </div>
      </div>
      <div className="flex border-t border-border">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-ink hover:bg-surface transition"
        >
          <Edit className="w-4 h-4" />
          تعديل
        </button>
        <div className="w-px bg-border" />
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          حذف
        </button>
      </div>
    </li>
  )
}

function ProductRow({
  product,
  categoryName,
  onEdit,
  onDelete,
  onToggleAvailability,
  deleting,
}: {
  product: Product
  categoryName: string
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
  deleting: boolean
}) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  return (
    <tr className={`hover:bg-surface/50 transition ${deleting ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface shrink-0">
            {product.media[0] ? (
              <img
                src={product.media[0].thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <Package className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink truncate">{product.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {product.featured && <BadgeIcon icon={Star} color="text-amber-500" />}
              {product.popular && <BadgeIcon icon={TrendingUp} color="text-rose-500" />}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-muted text-sm">{categoryName}</td>
      <td className="px-4 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-ink tabular-nums">{product.price.toFixed(0)}</span>
          <span className="text-xs text-muted">ج.م</span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through tabular-nums">
              {product.oldPrice!.toFixed(0)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <AvailabilityToggle available={product.available} onChange={onToggleAvailability} />
      </td>
      <td className="px-4 py-3 text-muted text-sm tabular-nums">{product.sortOrder}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-surface text-ink"
            aria-label="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
            aria-label="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function AvailabilityToggle({
  available,
  onChange,
}: {
  available: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={available}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition shrink-0 ${
        available ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          available ? 'translate-x-[-22px]' : 'translate-x-[-2px]'
        }`}
      />
    </button>
  )
}

function BadgeIcon({ icon: Icon, color }: { icon: any; color: string }) {
  return <Icon className={`w-3.5 h-3.5 ${color}`} fill="currentColor" />
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean
  onClear: () => void
}) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center mb-3">
        <Package className="w-7 h-7 text-muted" />
      </div>
      <h3 className="font-bold text-ink">
        {hasFilters ? 'لا توجد نتائج' : 'لا توجد منتجات بعد'}
      </h3>
      <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
        {hasFilters
          ? 'جرّب تغيير الفلاتر أو البحث بكلمات مختلفة.'
          : 'ابدأ بإضافة أول منتج لمتجرك.'}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          مسح الفلاتر
        </button>
      ) : null}
    </div>
  )
}
