import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/firebase/firestore'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Category } from '@/types'
import CategoryForm from '@/components/admin/CategoryForm'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    const data = await getCategories('abu-qir-demo')
    setCategories(data)
    setLoading(false)
  }

  const handleSave = async (data: Partial<Category>) => {
    if (editing) {
      await updateCategory('abu-qir-demo', editing.id, data)
    } else {
      await createCategory('abu-qir-demo', data)
    }
    setShowForm(false)
    setEditing(null)
    loadCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return
    await deleteCategory('abu-qir-demo', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const toggleActive = async (cat: Category) => {
    await updateCategory('abu-qir-demo', cat.id, { active: !cat.active })
    loadCategories()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">الأقسام</h3>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة قسم
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <CategoryForm
            category={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد أقسام</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{cat.name}</h4>
                <p className="text-sm text-gray-500">{cat.description}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {cat.active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(cat); setShowForm(true) }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(cat)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                  {cat.active ? 'إخفاء' : 'إظهار'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
