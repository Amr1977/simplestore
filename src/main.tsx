import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth'
import { CartProvider } from './features/cart'
import { StoreProvider } from './features/store'
import App from './App'
import './index.css'

function getStoreSlug(): string {
  const path = window.location.pathname
  const segments = path.split('/').filter(Boolean)
  if (segments.length > 0) {
    return segments[0]
  }
  return 'default'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider slug={getStoreSlug()}>
          <CartProvider>
            <App />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
