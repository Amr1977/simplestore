import { useEffect, useState } from 'react'
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getPopularProducts,
  searchProducts,
} from '@/firebase/firestore'
import type { Product } from '@/types'

export function useProducts(storeId: string, categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProducts(storeId, categoryId)
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل المنتجات')
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
  }, [storeId, categoryId])

  return { products, loading, error }
}

export function useProduct(storeId: string, productId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProduct(storeId, productId)
        if (!cancelled) {
          setProduct(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل المنتج')
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
  }, [storeId, productId])

  return { product, loading, error }
}

export function useFeaturedProducts(storeId: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getFeaturedProducts(storeId)
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل المنتجات المميزة')
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

  return { products, loading, error }
}

export function usePopularProducts(storeId: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPopularProducts(storeId)
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل المنتجات الشائعة')
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

  return { products, loading, error }
}

export function useSearchProducts(storeId: string, query: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function search() {
      if (!query.trim()) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const data = await searchProducts(storeId, query)
        if (!cancelled) {
          setProducts(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل البحث عن المنتجات')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    search()

    return () => {
      cancelled = true
    }
  }, [storeId, query])

  return { products, loading, error }
}
