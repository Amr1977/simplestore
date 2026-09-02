import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/helpers'
import { useCart } from '@/features/cart/CartContext'
import { QuantityControl } from './QuantityControl'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
  variant?: 'default' | 'skeleton' | 'hero'
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface-elevated overflow-hidden animate-pulse">
      <div className="aspect-square bg-border/40" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-border/50 w-3/4" />
        <div className="h-3 bg-border/40 w-1/2" />
        <div className="flex items-end justify-between pt-2">
          <div className="h-5 bg-border/50 w-1/3" />
          <div className="h-9 w-9 rounded-full bg-border/50" />
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
  const isHero = variant === 'hero'
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0

  return (
    <article
      className={`group relative flex flex-col bg-surface-elevated overflow-hidden transition-all duration-300 ${
        isHero ? 'lg:row-span-2' : ''
      }`}
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <div
          className={`relative overflow-hidden bg-[#f0e8d6] ${
            isHero ? 'aspect-square lg:aspect-[4/5]' : 'aspect-square'
          }`}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-border/40 animate-pulse" />
          )}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center bg-accent text-ink text-[11px] font-bold px-2.5 py-1 tracking-wide">
                −{discountPct}٪
              </span>
            </div>
          )}

          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--color-overlay)' }}>
              <span className="bg-surface-elevated text-ink text-xs font-bold px-3 py-1.5 tracking-wider">
                غير متوفر
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className={`flex flex-col flex-1 ${isHero ? 'p-4 lg:p-6' : 'p-4'}`}>
        <Link to={`/product/${product.id}`} className="block">
          <h3
            className={`font-bold text-ink leading-snug line-clamp-2 transition-colors group-hover:text-primary ${
              isHero ? 'text-[15px] lg:text-xl' : 'text-[15px]'
            }`}
          >
            {product.name}
          </h3>
        </Link>

        {product.unit && (
          <p className={`text-muted mt-1 ${isHero ? 'text-xs lg:text-sm' : 'text-xs'}`}>
            {product.unit}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-3">
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-primary leading-none ${
                isHero ? 'text-lg lg:text-3xl' : 'text-lg'
              }`}
            >
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] text-muted mt-1">
              جنيه / {product.unit || 'وحدة'}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through mt-0.5">
                {formatPrice(product.oldPrice!)}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onUpdate={(q) => updateQuantity(product.id, q)}
              size={isHero ? 'md' : 'sm'}
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.available}
              aria-label={`أضف ${product.name} للسلة`}
              className={`inline-flex items-center justify-center rounded-full bg-ink text-surface-elevated transition-all duration-200 ease-out hover:bg-primary disabled:bg-border disabled:text-muted disabled:cursor-not-allowed ${
                isHero ? 'w-9 h-9 lg:w-11 lg:h-11' : 'w-9 h-9'
              }`}
            >
              {isHero ? <Plus size={16} strokeWidth={2.25} className="lg:hidden" /> : <ShoppingCart size={16} strokeWidth={2.25} />}
              <Plus size={20} strokeWidth={2.25} className="hidden lg:block" />
            </button>
          )}
        </div>
      </div>

      {isHero && product.description && (
        <div className="hidden lg:block px-6 pb-6 -mt-1">
          <p className="text-sm text-ink-soft leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      )}
    </article>
  )
}
