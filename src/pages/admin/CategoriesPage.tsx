import { useState, useEffect, useMemo } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/firebase/firestore'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  FolderTree,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Package,
} from 'lucide-react'
import type { Category } from '@/types'
import CategoryForm from '@/components/admin/CategoryForm'

type StatusFilter = 'all' | 'active' | 'inactive'
type SortBy = 'order' | 'name' | 'newest' | 'oldest'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<{ id: string; categoryId: string }[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('order')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [cats, prods] = await Promise.all([
        getCategories('abu-qir-demo'),
        fetchAllProducts(),
      ])
      setCategories(cats)
      setProducts(prods)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async (): Promise<{ id: string; categoryId: string }[]> => {
    const { getProducts } = await import('@/firebase/firestore')
    return getProducts('abu-qir-demo') as any
  }

  const handleSave = async (data: Partial<Category>) => {
    if (editing) {
      await updateCategory('abu-qir-demo', editing.id, data)
    } else {
      await createCategory('abu-qir-demo', data)
    }
    setShowForm(false)
    setEditing(null)
    await loadAll()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    setDeletingId(id)
    try {
      await deleteCategory('abu-qir-demo', id)
      setCategories(prev => prev.filter(c => c.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (cat: Category) => {
    setCategories(prev =>
      prev.map(c => (c.id === cat.id ? { ...c, active: !c.active } : c))
    )
    try {
      await updateCategory('abu-qir-demo', cat.id, { active: !cat.active })
    } catch {
      setCategories(prev =>
        prev.map(c => (c.id === cat.id ? { ...c, active: cat.active } : c))
      )
    }
  }

  const productCount = (catId: string) =>
    products.filter(p => p.categoryId === catId).length

  const filtered = useMemo(() => {
    let list = categories
    if (status === 'active') list = list.filter(c => c.active)
    if (status === 'inactive') list = list.filter(c => !c.active)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar'))
    else if (sortBy === 'newest')
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
      )
    else if (sortBy === 'oldest')
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()
      )
    else sorted.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    return sorted
  }, [categories, search, status, sortBy])

  const stats = useMemo(() => {
    const total = categories.length
    const active = categories.filter(c => c.active).length
    return { total, active, inactive: total - active }
  }, [categories])

  const hasActiveFilters = status !== 'all' || search.trim() !== ''

  const clearFilters = () => {
    setStatus('all')
    setSearch('')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">الأقسام</h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {loading ? '...' : `${stats.total} قسم · ${stats.active} نشط`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة قسم</span>
          <span className="sm:hidden">جديد</span>
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <StatTile label="إجمالي" value={stats.total} icon={FolderTree} color="bg-blue-50 text-blue-700" />
        <StatTile label="نشط" value={stats.active} icon={Eye} color="bg-green-50 text-green-700" />
        <StatTile label="غير نشط" value={stats.inactive} icon={EyeOff} color="bg-gray-100 text-gray-600" />
      </div>

      {showForm && (
        <div className="bg-surface-elevated border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="font-bold text-ink mb-4">
            {editing ? `تعديل: ${editing.name}` : 'قسم جديد'}
          </h2>
          <CategoryForm
            category={editing}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {!showForm && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث في الأقسام..."
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
                    {(status !== 'all' ? 1 : 0) + (search ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="bg-surface-elevated border border-border rounded-lg p-3 sm:p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">الحالة</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['all', 'active', 'inactive'] as StatusFilter[]).map(s => (
                      <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
                        {s === 'all' ? 'الكل' : s === 'active' ? 'نشط' : 'غير نشط'}
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
            <EmptyState
              hasFilters={hasActiveFilters}
              onClear={clearFilters}
              onAdd={() => {
                setEditing(null)
                setShowForm(true)
              }}
            />
          ) : (
            <>
              <ul className="space-y-3 md:hidden">
                {filtered.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    productCount={productCount(cat.id)}
                    onEdit={() => {
                      setEditing(cat)
                      setShowForm(true)
                    }}
                    onDelete={() => handleDelete(cat.id, cat.name)}
                    onToggle={() => toggleActive(cat)}
                    deleting={deletingId === cat.id}
                  />
                ))}
              </ul>

              <div className="hidden md:block bg-surface-elevated border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide w-16">
                          #
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">
                          القسم
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">
                          الوصف
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">
                          المنتجات
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide">
                          الحالة
                        </th>
                        <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wide w-32">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map(cat => (
                        <CategoryRow
                          key={cat.id}
                          category={cat}
                          productCount={productCount(cat.id)}
                          onEdit={() => {
                            setEditing(cat)
                            setShowForm(true)
                          }}
                          onDelete={() => handleDelete(cat.id, cat.name)}
                          onToggle={() => toggleActive(cat)}
                          deleting={deletingId === cat.id}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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

function CategoryCard({
  category,
  productCount,
  onEdit,
  onDelete,
  onToggle,
  deleting,
}: {
  category: Category
  productCount: number
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  deleting: boolean
}) {
  return (
    <li
      className={`bg-surface-elevated border border-border rounded-xl overflow-hidden transition ${
        deleting ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface shrink-0">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-ink text-sm leading-snug line-clamp-1">
              {category.name}
            </h3>
            <button
              type="button"
              onClick={onToggle}
              role="switch"
              aria-checked={category.active}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition shrink-0 ${
                category.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                  category.active ? 'translate-x-[-18px]' : 'translate-x-[-2px]'
                }`}
              />
            </button>
          </div>
          {category.description && (
            <p className="text-xs text-muted mt-0.5 line-clamp-2">{category.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Package size={12} />
              <span dir="ltr" className="tabular-nums">{productCount}</span> منتج
            </span>
            <span aria-hidden>·</span>
            <span>ترتيب <span dir="ltr" className="tabular-nums">{category.sortOrder ?? 0}</span></span>
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

function CategoryRow({
  category,
  productCount,
  onEdit,
  onDelete,
  onToggle,
  deleting,
}: {
  category: Category
  productCount: number
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  deleting: boolean
}) {
  return (
    <tr className={`hover:bg-surface/50 transition ${deleting ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold text-ink">{category.name}</p>
      </td>
      <td className="px-4 py-3 text-muted text-sm max-w-xs truncate">
        {category.description}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-sm text-ink">
          <Package size={14} className="text-muted" />
          <span dir="ltr" className="tabular-nums">{productCount}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          role="switch"
          aria-checked={category.active}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition shrink-0 ${
            category.active ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              category.active ? 'translate-x-[-22px]' : 'translate-x-[-2px]'
            }`}
          />
        </button>
      </td>
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

function EmptyState({
  hasFilters,
  onClear,
  onAdd,
}: {
  hasFilters: boolean
  onClear: () => void
  onAdd: () => void
}) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center mb-3">
        <FolderTree className="w-7 h-7 text-muted" />
      </div>
      <h3 className="font-bold text-ink">
        {hasFilters ? 'لا توجد نتائج' : 'لا توجد أقسام بعد'}
      </h3>
      <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
        {hasFilters
          ? 'جرّب تغيير الفلاتر أو البحث بكلمات مختلفة.'
          : 'ابدأ بإضافة أول قسم لتنظيم منتجات متجرك.'}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <X className="w-4 h-4" />
          مسح الفلاتر
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم
        </button>
      )}
    </div>
  )
}
