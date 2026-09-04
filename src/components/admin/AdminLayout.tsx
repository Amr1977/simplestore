import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:mr-64 pb-36 md:pb-0">
        <AdminHeader />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
