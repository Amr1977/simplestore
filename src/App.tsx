import { Routes, Route } from 'react-router-dom'
import { AdminRoute } from '@/components/admin/AdminRoute'
import AdminLayout from '@/components/admin/AdminLayout'
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
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="stores" element={<AdminStoresPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="seed" element={<SeedPage />} />
      </Route>
    </Routes>
  )
}
