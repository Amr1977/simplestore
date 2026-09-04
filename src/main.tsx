import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithCustomToken,
  type Auth,
} from 'firebase/auth'
import { AuthProvider } from './features/auth'
import { CartProvider } from './features/cart'
import { StoreProvider } from './features/store'
import { ThemeProvider } from './features/theme'
import { getStoreSlug } from './lib/store'
import { auth } from './firebase/config'
import App from './App'
import './index.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(regs => regs.forEach(reg => reg.unregister().catch(() => {})))
    .catch(() => {})
  if ('caches' in window) {
    caches.keys()
      .then(keys => keys.forEach(k => caches.delete(k).catch(() => {})))
      .catch(() => {})
  }
}

// Expose Firebase auth on window for e2e tests. In production this is a
// no-op for app code; only the test harness reads it. Wrapped in import.meta.env
// to make intent explicit. Tree-shaken in production builds because VITE_E2E
// is never set in prod.
declare global {
  interface Window {
    __FIREBASE_AUTH__?: Auth
    __signInWithGoogleCredential__?: (idToken: string) => Promise<unknown>
    __signInWithCustomToken__?: (token: string) => Promise<unknown>
  }
}
if (import.meta.env.VITE_E2E === 'true') {
  window.__FIREBASE_AUTH__ = auth
  window.__signInWithGoogleCredential__ = (idToken: string) =>
    signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
  window.__signInWithCustomToken__ = (token: string) => signInWithCustomToken(auth, token)
}

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

