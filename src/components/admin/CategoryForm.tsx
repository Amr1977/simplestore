import { useState, type FormEvent } from 'react'
import type { Category } from '@/types'

interface CategoryFormProps {
  category?: Partial<Category> | null
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
}

export default function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '')
  const [sortOrder, setSortOrder] = useState(category?.sortOrder?.toString() || '0')
  const [active, setActive] = useState(category?.active ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'اسم القسم مطلوب'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      sortOrder: parseInt(sortOrder) || 0,
      active,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم القسم *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
          placeholder="مثال: خضروات"
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
        <input
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
        <input
          type="number"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
        <span className="text-sm text-gray-700">نشط</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          {category?.id ? 'تحديث' : 'إضافة'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}
