import { useState } from 'react'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { store } from '@/data/store'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { Store, Category, Product } from '@/types'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSeed = async () => {
    setLoading(true)
    setProgress('جاري التحضير... | Preparing...')
    setMessage('')
    setError('')

    try {
      const storeId = store.id

      const operations: { path: string; data: Partial<Store | Category | Product> }[] = []

      const storeData = { ...store }
      delete (storeData as any).id
      operations.push({ path: `stores/${storeId}`, data: storeData })

      const storeCategories = categories.filter(c => c.storeId === storeId)
      for (const category of storeCategories) {
        const catData = { ...category }
        delete (catData as any).id
        delete (catData as any).storeId
        operations.push({ path: `stores/${storeId}/categories/${category.id}`, data: catData })
      }

      const storeProducts = products.filter(p => p.storeId === storeId)
      for (const product of storeProducts) {
        const prodData = { ...product }
        delete (prodData as any).id
        delete (prodData as any).storeId
        operations.push({ path: `stores/${storeId}/products/${product.id}`, data: prodData })
      }

      const BATCH_LIMIT = 500
      const batches: ReturnType<typeof writeBatch>[] = []
      let currentBatch = writeBatch(db)
      let batchCount = 0

      for (let i = 0; i < operations.length; i++) {
        const { path, data } = operations[i]
        const ref = doc(db, path)
        currentBatch.set(ref, data)
        batchCount++

        if (batchCount === BATCH_LIMIT) {
          batches.push(currentBatch)
          currentBatch = writeBatch(db)
          batchCount = 0
        }
      }

      if (batchCount > 0) {
        batches.push(currentBatch)
      }

      for (let i = 0; i < batches.length; i++) {
        setProgress(`جاري كتابة الدفعة [${i + 1}/${batches.length}]... | Committing batch [${i + 1}/${batches.length}]...`)
        await batches[i].commit()
      }

      setMessage(`تم الانتهاء بنجاح! / Seeding completed! | المتجر / Store: ${storeId} | الأقسام / Categories: ${storeCategories.length} | المنتجات / Products: ${storeProducts.length}`)
      setProgress('')
    } catch (e) {
      console.error('Seed error:', e)
      setError(`خطأ / Error: ${e instanceof Error ? e.message : 'unknown error'}`)
      setProgress('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">كتابة بيانات تجريبية | Seed Demo Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          سيتم كتابة بيانات المتجر والأقسام والمنتجات إلى Firestore.
          <br />
          This will write the store, categories, and products to Firestore.
        </p>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'جاري الكتابة... | Seeding...' : 'كتابة البيانات التجريبية | Seed Demo Data'}
        </button>

        {progress && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            {progress}
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
