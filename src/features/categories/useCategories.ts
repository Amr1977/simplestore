import { useEffect, useState } from 'react'
import { getCategories } from '@/firebase/firestore'
import type { Category } from '@/types'

export function useCategories(storeId: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getCategories(storeId)
        if (!cancelled) {
          setCategories(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل الأقسام')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [storeId])

  return { categories, loading, error }
}
