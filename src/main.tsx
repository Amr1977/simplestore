import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth'
import { CartProvider } from './features/cart'
import { StoreProvider } from './features/store'
import { ThemeProvider } from './features/theme'
import { getStoreSlug } from './lib/store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider slug={getStoreSlug()}>
            <CartProvider>
              <App />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
