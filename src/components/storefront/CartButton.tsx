import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/features/cart/CartContext'

export default function CartButton() {
  const { getCartCount } = useCart()
  const itemCount = getCartCount()

  if (itemCount === 0) return null

  return (
    <div className="md:hidden sticky bottom-0 left-0 right-0 z-40 bg-surface-elevated/95 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Link
          to="/cart"
          className="w-full inline-flex items-center justify-center gap-2.5 bg-primary text-surface-elevated px-5 py-3.5 rounded-full text-sm font-bold hover:bg-primary-soft transition"
        >
          <ShoppingCart size={20} />
          <span>
            {itemCount} {itemCount === 1 ? 'منتج' : 'منتجات'}
          </span>
          <span className="bg-surface-elevated text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </Link>
      </div>
    </div>
  )
}
