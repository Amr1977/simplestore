import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Menu,
  X,
  Store,
  Home,
  Search,
  Phone,
  MapPin,
  Download,
  LayoutDashboard,
  LogIn,
  LogOut,
} from 'lucide-react'
import { useStore } from '@/features/store/StoreContext'
import { useCart } from '@/features/cart/CartContext'
import { useCategories } from '@/features/categories/useCategories'
import { useAuth } from '@/features/auth'
import { ThemeToggle } from '@/features/theme'
import { generateStoreLogo } from '@/lib/storeLogo'

export default function Header() {
  const { store, storeId, loading } = useStore()
  const { getCartCount } = useCart()
  const { categories } = useCategories(storeId)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const itemCount = getCartCount()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleNav = (path: string) => {
    setIsMenuOpen(false)
    navigate(path)
  }

  const handleAdminSignOut = async () => {
    setIsMenuOpen(false)
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      navigate('/')
    }
  }

  if (loading || !store) {
    return (
      <header className="sticky top-0 z-50 bg-surface-elevated/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
          <div className="h-5 bg-border rounded w-32 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface-elevated/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -mr-1 rounded-full hover:bg-border/40 transition"
              aria-label="فتح القائمة"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={22} />
            </button>
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                onError={(e) => {
                  const el = e.currentTarget
                  if (el.dataset.fallback === '1') return
                  el.dataset.fallback = '1'
                  el.src = generateStoreLogo({ name: store.name, shape: 'square', size: { width: 64, height: 64 } })
                }}
                className="w-8 h-8 rounded-full object-cover bg-surface"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Store size={18} />
              </div>
            )}
            <h1 className="text-base font-bold text-ink truncate max-w-[180px] md:max-w-xs">
              {store.name}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-ink hover:bg-border/40 transition"
                  title="لوحة التحكم"
                  aria-label="لوحة التحكم"
                >
                  <LayoutDashboard size={18} className="text-muted" />
                  <span className="hidden lg:inline">لوحة التحكم</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdminSignOut}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  title="تسجيل الخروج"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline">خروج</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-ink hover:bg-border/40 transition"
                title="تسجيل دخول المسؤول"
                aria-label="تسجيل دخول المسؤول"
              >
                <LogIn size={18} className="text-muted" />
                <span className="hidden lg:inline">دخول</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-full hover:bg-border/40 transition"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart size={22} className="text-ink" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-accent text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] md:hidden" style={{ backgroundColor: 'var(--color-overlay)' }}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الرئيسية"
            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-surface-elevated z-[70] md:hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 h-14 border-b border-border">
              <span className="font-display text-lg font-bold text-ink">القائمة</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-border/40 transition"
                aria-label="إغلاق القائمة"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNav('/')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                  >
                    <Home size={20} className="text-muted" />
                    <span className="font-medium">الرئيسية</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNav('/search')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                  >
                    <Search size={20} className="text-muted" />
                    <span className="font-medium">البحث عن منتج</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNav('/cart')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                  >
                    <ShoppingCart size={20} className="text-muted" />
                    <span className="font-medium">سلة المشتريات</span>
                    {itemCount > 0 && (
                      <span className="mr-auto bg-primary text-surface-elevated text-xs font-bold px-2 py-0.5 rounded-full">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNav('/download')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                  >
                    <Download size={20} className="text-muted" />
                    <span className="font-medium">تحميل التطبيق</span>
                  </button>
                </li>
              </ul>

              {categories.length > 0 && (
                <div className="mt-6 px-3">
                  <h2 className="px-4 mb-2 text-xs font-bold text-muted uppercase tracking-wider">
                    الأقسام
                  </h2>
                  <ul className="space-y-1">
                    {categories.map(category => (
                      <li key={category.id}>
                        <button
                          type="button"
                          onClick={() => handleNav(`/category/${category.id}`)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                          <span className="font-medium">{category.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 px-3 border-t border-border pt-4">
                <h2 className="px-4 mb-2 text-xs font-bold text-muted uppercase tracking-wider">
                  المسؤول
                </h2>
                <ul className="space-y-1">
                  {user ? (
                    <>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleNav('/admin')}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                        >
                          <LayoutDashboard size={20} className="text-muted" />
                          <span className="font-medium">لوحة التحكم</span>
                        </button>
                      </li>
                      <li>
                        <div className="px-4 py-2 text-xs text-muted truncate" dir="ltr">
                          {user.email}
                        </div>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={handleAdminSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition text-right"
                        >
                          <LogOut size={20} />
                          <span className="font-medium">تسجيل الخروج</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNav('/admin/login')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-border/40 transition text-right"
                      >
                        <LogIn size={20} className="text-muted" />
                        <span className="font-medium">تسجيل دخول المسؤول</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </nav>

            <div className="px-5 py-4 border-t border-border space-y-2 text-sm text-muted">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center gap-2 hover:text-ink transition"
                >
                  <Phone size={16} />
                  <span dir="ltr">{store.phone}</span>
                </a>
              )}
              {store.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{store.address}</span>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  )
}
