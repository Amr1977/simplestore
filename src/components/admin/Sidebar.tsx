import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/admin/products', icon: Package, label: 'المنتجات' },
  { to: '/admin/categories', icon: FolderTree, label: 'الأقسام' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' },
  { to: '/admin/settings', icon: Settings, label: 'الإعدادات' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <>
      <aside className="hidden md:flex flex-col fixed right-0 top-0 bottom-0 w-64 bg-surface-elevated border-l border-gray-200 z-40">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-green-700">إدارة المتجر</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-gray-200 z-40 flex justify-around py-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs transition-colors ${
                isActive ? 'text-green-700' : 'text-gray-500'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
