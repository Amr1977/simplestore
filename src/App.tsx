import { Routes, Route } from 'react-router-dom'
import { AdminRoute } from '@/components/admin/AdminRoute'
import HomePage from '@/pages/HomePage'
import CategoryPage from '@/pages/CategoryPage'
import ProductPage from '@/pages/ProductPage'
import SearchPage from '@/pages/SearchPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import DownloadPage from '@/pages/DownloadPage'
import AdminLoginPage from '@/pages/admin/LoginPage'
import AdminSignupPage from '@/pages/admin/StoreSignupPage'
import AdminDashboardPage from '@/pages/admin/DashboardPage'
import AdminProductsPage from '@/pages/admin/ProductsPage'
import AdminProductFormPage from '@/pages/admin/ProductFormPage'
import AdminCategoriesPage from '@/pages/admin/CategoriesPage'
import AdminOrdersPage from '@/pages/admin/OrdersPage'
import AdminOrderDetailPage from '@/pages/admin/OrderDetailPage'
import AdminSettingsPage from '@/pages/admin/SettingsPage'
import AdminStoresPage from '@/pages/admin/StoresListPage'
import SeedPage from '@/pages/admin/SeedPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/signup" element={<AdminSignupPage />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/stores" element={<AdminRoute><AdminStoresPage /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
      <Route path="/admin/products/new" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
      <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
      <Route path="/admin/seed" element={<AdminRoute><SeedPage /></AdminRoute>} />
    </Routes>
  )
}
