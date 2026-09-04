import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { getStoreBySlug } from '@/firebase/firestore'
import type { Store } from '@/types'

interface StoreContextValue {
  store: Store | null
  storeId: string
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const CreateStoreContext = createContext<StoreContextValue | undefined>(undefined)

interface StoreProviderProps {
  children: ReactNode
  slug: string
}

export function StoreProvider({ children, slug }: StoreProviderProps) {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStore = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStoreBySlug(slug)
      setStore(data)
      if (!data) {
        setError('المتجر غير موجود')
      }
    } catch (e) {
      setError('فشل تحميل بيانات المتجر')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (cancelled) return
      await loadStore()
    }
    run()
    return () => {
      cancelled = true
    }
  }, [loadStore])

  return (
    <CreateStoreContext.Provider
      value={{ store, storeId: store?.id ?? '', loading, error, refresh: loadStore }}
    >
      {children}
    </CreateStoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(CreateStoreContext)
  if (context === undefined) {
    throw new Error('يجب استخدام useStore داخل StoreProvider')
  }
  return context
}
