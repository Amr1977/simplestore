import { describe, it, expect, beforeEach } from 'vitest'

interface CartItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  imageUrl: string
  available: boolean
}

interface Cart {
  items: CartItem[]
  storeId: string
}

const CART_STORAGE_KEY = 'grocery_cart'

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

function addToCart(
  items: CartItem[],
  product: { id: string; name: string; price: number; unit: string; imageUrl: string; available: boolean },
  storeId: string
): CartItem[] {
  const existing = items.find((item) => item.productId === product.id)
  let newItems: CartItem[]
  if (existing) {
    newItems = items.map((item) =>
      item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
    )
  } else {
    newItems = [
      ...items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: 1,
        imageUrl: product.imageUrl,
        available: product.available,
      },
    ]
  }
  saveCartToStorage({ items: newItems, storeId })
  return newItems
}

function removeFromCart(items: CartItem[], productId: string, storeId: string): CartItem[] {
  const newItems = items.filter((item) => item.productId !== productId)
  saveCartToStorage({ items: newItems, storeId })
  return newItems
}

function updateQuantity(items: CartItem[], productId: string, quantity: number, storeId: string): CartItem[] {
  if (quantity <= 0) {
    const newItems = items.filter((item) => item.productId !== productId)
    saveCartToStorage({ items: newItems, storeId })
    return newItems
  }
  const newItems = items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
  saveCartToStorage({ items: newItems, storeId })
  return newItems
}

function clearCart(storeId: string): CartItem[] {
  const newItems: CartItem[] = []
  saveCartToStorage({ items: newItems, storeId })
  return newItems
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

describe('Cart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const storeId = 'abu-qir-demo'
  const tomato = {
    id: 'p1',
    name: 'طماطم',
    price: 15,
    unit: 'كجم',
    imageUrl: 'https://example.com/tomato.jpg',
    available: true,
  }
  const potato = {
    id: 'p2',
    name: 'بطاطس',
    price: 20,
    unit: 'كجم',
    imageUrl: 'https://example.com/potato.jpg',
    available: true,
  }
  const onion = {
    id: 'p3',
    name: 'بصل',
    price: 10,
    unit: 'كجم',
    imageUrl: 'https://example.com/onion.jpg',
    available: true,
  }

  it('adds items to cart', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    expect(items).toHaveLength(1)
    expect(items[0].name).toBe('طماطم')
    expect(items[0].quantity).toBe(1)
    expect(items[0].price).toBe(15)
  })

  it('increments quantity for existing item', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, tomato, storeId)
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('removes items from cart', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)
    items = removeFromCart(items, 'p1', storeId)
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe('p2')
  })

  it('updates quantity', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = updateQuantity(items, 'p1', 5, storeId)
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(5)
  })

  it('removes item when quantity set to 0', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = updateQuantity(items, 'p1', 0, storeId)
    expect(items).toHaveLength(0)
  })

  it('clears cart', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)
    items = clearCart(storeId)
    expect(items).toHaveLength(0)
  })

  it('calculates total', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)
    items = addToCart(items, onion, storeId)
    expect(calculateTotal(items)).toBe(45)
  })

  it('calculates item count', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)
    expect(calculateItemCount(items)).toBe(3)
  })

  it('loads from localStorage', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)

    const loaded = loadCartFromStorage()
    expect(loaded.items).toHaveLength(2)
    expect(loaded.storeId).toBe(storeId)
    expect(loaded.items.map((i) => i.name)).toEqual(['طماطم', 'بطاطس'])
  })

  it('saves to localStorage', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)
    items = addToCart(items, potato, storeId)

    const raw = localStorage.getItem(CART_STORAGE_KEY)
    expect(raw).toBeDefined()
    const parsed = JSON.parse(raw) as Cart
    expect(parsed.items).toHaveLength(2)
    expect(parsed.storeId).toBe(storeId)
  })

  it('persists cart across reloads', () => {
    let items: CartItem[] = []
    items = addToCart(items, tomato, storeId)

    const reloaded = loadCartFromStorage()
    expect(reloaded.items).toHaveLength(1)
    expect(reloaded.items[0].name).toBe('طماطم')
    expect(reloaded.items[0].quantity).toBe(1)
  })
})
