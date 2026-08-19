export interface Store {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  whatsappNumber: string
  phone: string
  address: string
  theme: StoreTheme
  delivery: DeliveryConfig
  openingHours: OpeningHours
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StoreTheme {
  preset: string
  primary: string
  secondary: string
  accent: string
}

export interface DeliveryConfig {
  enabled: boolean
  fee: number
  minimumOrder: number
  freeDeliveryThreshold: number | null
}

export interface OpeningHours {
  [key: string]: { open: string; close: string; closed?: boolean }
}

export interface Category {
  id: string
  storeId: string
  name: string
  description: string
  imageUrl: string
  sortOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductMedia {
  id: string
  type: 'image' | 'video'
  publicId: string
  secureUrl: string
  thumbnailUrl: string
  width: number
  height: number
  duration?: number
  sortOrder: number
}

export interface Product {
  id: string
  storeId: string
  name: string
  description: string
  categoryId: string
  price: number
  oldPrice?: number
  unit: string
  available: boolean
  featured: boolean
  popular: boolean
  sortOrder: number
  media: ProductMedia[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  imageUrl: string
  available: boolean
}

export interface Cart {
  items: CartItem[]
  storeId: string
}

export interface Order {
  id: string
  storeId: string
  customerName: string
  phone: string
  address: string
  notes: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  status: 'new' | 'contacted' | 'confirmed' | 'delivered' | 'cancelled'
  whatsappInitiatedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  imageUrl: string
}

export interface UserProfile {
  uid: string
  email: string
  role: 'vendor'
  storeId: string
  createdAt: Date
}
