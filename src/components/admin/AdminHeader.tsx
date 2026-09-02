import { useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'

const titles: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/products': 'المنتجات',
  '/admin/categories': 'الأقسام',
  '/admin/orders': 'الطلبات',
  '/admin/settings': 'الإعدادات',
}

export default function AdminHeader() {
  const location = useLocation()
  const { user } = useAuth()
  const path = location.pathname.replace(/\/\/+/g, '/')
  const title = titles[path] || 'لوحة التحكم'

  return (
    <header className="bg-surface-elevated border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.email}
          </span>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
