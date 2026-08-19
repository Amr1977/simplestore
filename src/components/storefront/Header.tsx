import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, Store } from 'lucide-react'
import { useStore } from '@/features/store/StoreContext'
import { useCart } from '@/features/cart/CartContext'

export default function Header() {
  const { store, loading } = useStore()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const itemCount = getCartCount()

  if (loading || !store) {
    return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-5 bg-gray-100 rounded w-32 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition md:hidden"
          aria-label="القائمة"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Store size={18} />
            </div>
          )}
          <h1 className="text-base font-bold text-gray-900 truncate max-w-[180px] md:max-w-xs">
            {store.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="relative p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
          aria-label="سلة المشتريات"
        >
          <ShoppingCart size={22} className="text-gray-700" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
