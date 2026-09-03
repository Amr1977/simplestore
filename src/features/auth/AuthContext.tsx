import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, loginWithGoogle, logout } from '@/firebase/auth'

export const CreateAuthContext = createContext<{
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<User>
  logout: () => Promise<void>
} | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((u: User | null) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleLoginWithGoogle = async () => {
    return loginWithGoogle()
  }

  const handleLogout = async () => {
    return logout()
  }

  return (
    <CreateAuthContext.Provider value={{ user, loading, loginWithGoogle: handleLoginWithGoogle, logout: handleLogout }}>
      {children}
    </CreateAuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(CreateAuthContext)
  if (context === undefined) {
    throw new Error('يجب استخدام useAuth داخل StoreProvider')
  }
  return context
}
