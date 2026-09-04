import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Settings, LogOut, Store, ExternalLink } from 'lucide-react'
import { useAuth } from '@/features/auth'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/admin/stores', icon: Store, label: 'المتاجر' },
  { to: '/admin/products', icon: Package, label: 'المنتجات' },
  { to: '/admin/categories', icon: FolderTree, label: 'الأقسام' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' },
  { to: '/admin/settings', icon: Settings, label: 'الإعدادات' },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

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
    <>
      <aside className="hidden md:flex flex-col fixed right-0 top-0 bottom-0 w-64 bg-surface-elevated border-l border-border z-40">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary">إدارة المتجر</h1>
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
                    ? 'bg-primary/10 text-primary'
                    : 'text-ink hover:bg-surface'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-surface transition-colors border-t border-border mt-2 pt-3"
          >
            <ExternalLink className="w-5 h-5 text-muted" />
            عرض المتجر
          </Link>
        </nav>
        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-border z-40 flex justify-around py-2">
        {links.slice(0, 5).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-xs text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>خروج</span>
        </button>
      </nav>
    </>
  )
}
