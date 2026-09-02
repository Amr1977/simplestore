import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/features/cart/CartContext'

export default function CartButton() {
  const { getCartCount } = useCart()
  const itemCount = getCartCount()

  if (itemCount === 0) return null

  return (
    <Link
      to="/cart"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:bg-primary/90 transition md:hidden"
    >
      <ShoppingCart size={20} />
      <span className="text-sm font-semibold">
        {itemCount} {itemCount === 1 ? 'منتج' : 'منتجات'}
      </span>
      <span className="bg-surface-elevated text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    </Link>
  )
}
