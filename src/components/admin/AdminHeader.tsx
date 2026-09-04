import { useLocation, useNavigate, Link } from 'react-router-dom'
import { LogOut, Store } from 'lucide-react'
import { useAuth } from '@/features/auth'

const titles: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/stores': 'المتاجر',
  '/admin/products': 'المنتجات',
  '/admin/categories': 'الأقسام',
  '/admin/orders': 'الطلبات',
  '/admin/settings': 'الإعدادات',
}

export default function AdminHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const path = location.pathname.replace(/\/\/+/g, '/')
  const title = titles[path] || 'لوحة التحكم'

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      navigate('/', { replace: true })
    }
  }

  return (
    <header className="bg-surface-elevated border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <h2 className="text-lg font-bold text-ink truncate">{title}</h2>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-ink hover:bg-surface transition"
            title="العودة إلى المتجر"
          >
            <Store size={16} className="text-muted" />
            <span>المتجر</span>
          </Link>
          <span className="text-sm text-muted hidden md:block truncate max-w-[180px]" dir="ltr">
            {user?.email}
          </span>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  )
}
