import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Cart } from '@/types'
import { CreateStoreContext } from '@/features/store/StoreContext'

const CART_STORAGE_KEY = 'grocery_cart'

interface CartContextValue {
  items: CartItem[]
  storeId: string
  loading: boolean
  addToCart: (product: {
    id: string
    name: string
    price: number
    unit: string
    imageUrl: string
    available: boolean
  }) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  loadCart: () => CartItem[]
}

export const CreateCartContext = createContext<CartContextValue | undefined>(undefined)

function loadCartFromStorage(): Cart {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    // corrupted data
  }
  return { items: [], storeId: '' }
}

function saveCartToStorage(cart: Cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

interface CartProviderProps {
  children: ReactNode
  storeId?: string
}

export function CartProvider({ children, storeId: propStoreId }: CartProviderProps) {
  const storeContext = useContext(CreateStoreContext)
  const storeId = propStoreId ?? storeContext?.store?.id ?? ''
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cart = loadCartFromStorage()
    if (cart.storeId === storeId && cart.items.length > 0) {
      setItems(cart.items)
    } else {
      setItems([])
    }
    setLoading(false)
  }, [storeId])

  const addToCart = useCallback((product: {
    id: string
    name: string
    price: number
    unit: string
    imageUrl: string
    available: boolean
  }) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id)
      let newItems: CartItem[]
      if (existing) {
        newItems = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prev, {
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: 1,
          imageUrl: product.imageUrl,
          available: product.available,
        }]
      }
      saveCartToStorage({ items: newItems, storeId })
      return newItems
    })
  }, [storeId])

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.productId !== productId)
      saveCartToStorage({ items: newItems, storeId })
      return newItems
    })
  }, [storeId])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => {
      if (quantity <= 0) {
        const newItems = prev.filter(item => item.productId !== productId)
        saveCartToStorage({ items: newItems, storeId })
        return newItems
      }
      const newItems = prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
      saveCartToStorage({ items: newItems, storeId })
      return newItems
    })
  }, [storeId])

  const clearCart = useCallback(() => {
    setItems([])
    saveCartToStorage({ items: [], storeId })
  }, [storeId])

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  const loadCart = useCallback(() => {
    return items
  }, [items])

  return (
    <CreateCartContext.Provider value={{
      items,
      storeId,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      loadCart,
    }}>
      {children}
    </CreateCartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CreateCartContext)
  if (context === undefined) {
    throw new Error('يجب استخدام useCart داخل CartProvider')
  }
  return context
}
