import { useState, useEffect, type FormEvent } from 'react'
import type { Product, Category, ProductMedia } from '@/types'
import MediaManager from './MediaManager'
import { uploadToCloudinary } from '@/lib/cloudinary'

interface ProductFormProps {
  product?: Partial<Product> | null
  storeId: string
  categories: Category[]
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
}

export default function ProductForm({ product, storeId, categories, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() || '')
  const [unit, setUnit] = useState(product?.unit || '')
  const [available, setAvailable] = useState(product?.available ?? true)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [popular, setPopular] = useState(product?.popular ?? false)
  const [sortOrder, setSortOrder] = useState(product?.sortOrder?.toString() || '0')
  const [media, setMedia] = useState<ProductMedia[]>(product?.media || [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  const handleUpload = async (files: FileList | null) => {
    if (!files) return
    const uploads: ProductMedia[] = []
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/')
      const result = await uploadToCloudinary(file, `stores/${storeId}/products`)
      uploads.push({
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type: isVideo ? 'video' : 'image',
        publicId: result.publicId,
        secureUrl: result.secureUrl,
        thumbnailUrl: result.thumbnailUrl,
        width: result.width,
        height: result.height,
        duration: isVideo ? 0 : undefined,
        sortOrder: media.length + uploads.length,
      })
    }
    // New uploads become primary: place them at sortOrder 0 and shift the rest.
    setMedia(prev => {
      const shifted = prev.map(m => ({ ...m, sortOrder: m.sortOrder + uploads.length }))
      return [...uploads.map((u, i) => ({ ...u, sortOrder: i })), ...shifted]
    })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'اسم المنتج مطلوب'
    if (!categoryId) errs.categoryId = 'القسم مطلوب'
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) errs.price = 'السعر يجب أن يكون أكبر من أو يساوي صفر'
    const oldPriceNum = oldPrice ? parseFloat(oldPrice) : null
    if (oldPriceNum !== null && (isNaN(oldPriceNum) || oldPriceNum < priceNum)) {
      errs.oldPrice = 'السعر القديم يجب أن يكون أكبر من أو يساوي السعر الحالي'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await onSave({
      name: name.trim(),
      description: description.trim(),
      categoryId,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      unit: unit.trim(),
      available,
      featured,
      popular,
      sortOrder: parseInt(sortOrder) || 0,
      media,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface-elevated rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">المعلومات الأساسية</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="مثال: أرز مصري"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="وصف المنتج..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">القسم *</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            <option value="">اختر قسم</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر القديم</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={oldPrice}
              onChange={e => setOldPrice(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.oldPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="0.00"
            />
            {errors.oldPrice && <p className="text-red-600 text-xs mt-1">{errors.oldPrice}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوحدة</label>
          <input
            type="text"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="مثال: كيلو، قطعة، علبة"
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
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
            <span className="text-sm text-gray-700">متوفر</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
            <span className="text-sm text-gray-700">مميز</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={popular} onChange={e => setPopular(e.target.checked)} className="rounded text-green-600 focus:ring-green-500" />
            <span className="text-sm text-gray-700">شائع</span>
          </label>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">الصور والفيديو</h3>
        <MediaManager
          media={media}
          onChange={setMedia}
          onUpload={handleUpload}
          onRemove={id => setMedia(prev => prev.filter(m => m.id !== id))}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'جاري الحفظ...' : product?.id ? 'تحديث المنتج' : 'إضافة المنتج'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}
