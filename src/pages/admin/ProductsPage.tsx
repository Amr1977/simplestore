import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct } from '@/firebase/firestore'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import type { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const data = await getProducts('abu-qir-demo')
    setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    await deleteProduct('abu-qir-demo', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن منتج..."
            className="w-full pr-10 pl-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد منتجات</div>
      ) : (
        <div className="bg-surface-elevated rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">المنتج</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">السعر</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">الحالة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">الترتيب</th>
                  <th className="px-4 py-3 font-medium text-gray-500 w-24">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.media[0] && (
                          <img src={product.media[0].thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.unit || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{product.price.toFixed(0)} جنيه</p>
                        {product.oldPrice && <p className="text-xs text-gray-400 line-through">{product.oldPrice.toFixed(0)}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.available ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{product.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
