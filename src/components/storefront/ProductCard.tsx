import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/helpers'
import { useCart } from '@/features/cart/CartContext'
import { QuantityControl } from './QuantityControl'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
  variant?: 'default' | 'skeleton'
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-8 w-8 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductCard({ product, onAddToCart, variant = 'default' }: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cartItem = items.find(item => item.productId === product.id)
  const quantity = cartItem?.quantity ?? 0

  const handleAddToCart = () => {
    if (!product.available) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      imageUrl: product.media[0]?.secureUrl ?? '',
      available: product.available,
    })
    onAddToCart?.()
  }

  if (variant === 'skeleton') {
    return <ProductCardSkeleton />
  }

  const imageUrl = product.media[0]?.secureUrl ?? ''

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden group hover:shadow-md transition-shadow duration-200 flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full animate-pulse bg-gray-100" />
          )}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.available ? 'متاح' : 'غير متاح'}
          </span>
        </div>

        {product.oldPrice && product.oldPrice > product.price && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent/10 text-accent">
              خصم
            </span>
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.unit && (
          <p className="text-xs text-gray-500">{product.unit}</p>
        )}

        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onUpdate={(q) => updateQuantity(product.id, q)}
              size="sm"
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.available}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              aria-label="أضف للسلة"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
