import { useEffect, useState } from 'react'
import { getOrders, subscribeToOrders } from '@/firebase/firestore'
import type { Order } from '@/types'

export function useOrders(storeId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrders(storeId)
        if (!cancelled) {
          setOrders(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل الطلبات')
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

  const subscribe = (callback: (orders: Order[]) => void) => {
    return subscribeToOrders(storeId, callback)
  }

  return { orders, loading, error, subscribe }
}

export function useOrderDetail(storeId: string, orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrders(storeId)
        if (!cancelled) {
          const found = data.find((o: Order) => o.id === orderId) || null
          setOrder(found)
        }
      } catch (e) {
        if (!cancelled) {
          setError('فشل تحميل تفاصيل الطلب')
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
  }, [storeId, orderId])

  return { order, loading, error }
}
