import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle, user } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate('/admin', { replace: true })
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/admin')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/popup-closed-by-user') setError('تم إغلاق نافذة تسجيل الدخول')
      else if (code === 'auth/popup-blocked') setError('المتصفح يحجب النافذة المنبثقة. اسمح بالنوافذ المنبثقة وحاول مرة أخرى.')
      else setError('فشل تسجيل الدخول: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل دخول المسؤول</h1>
          <p className="text-sm text-gray-600 mt-1">سجّل دخولك عبر Google للوصول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span>جاري التحويل...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>تسجيل الدخول عبر Google</span>
            </>
          )}
        </button>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ليس لديك متجر بعد؟{' '}
            <a href="/admin/signup" className="text-green-600 hover:text-green-700 font-medium">
              أنشئ متجراً جديداً
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
