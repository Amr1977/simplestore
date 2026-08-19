import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getStoreBySlug } from '@/firebase/firestore'
import type { Store } from '@/types'

interface StoreContextValue {
  store: Store | null
  storeId: string
  loading: boolean
  error: string | null
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

  useEffect(() => {
    let cancelled = false

    async function loadStore() {
      setLoading(true)
      setError(null)
      try {
        const data = await getStoreBySlug(slug)
        if (!cancelled) {
          setStore(data)
          if (!data) {
            setError('المتجر غير موجود')
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل بيانات المتجر')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStore()

    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <CreateStoreContext.Provider value={{ store, storeId: store?.id ?? '', loading, error }}>
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
