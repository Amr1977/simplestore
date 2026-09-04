import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useStore } from '@/features/store/StoreContext'
import { Store, ArrowLeft, ShieldCheck, ChevronLeft } from 'lucide-react'
import { generateStoreLogo } from '@/lib/storeLogo'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle, user } = useAuth()
  const { store } = useStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/popup-closed-by-user') setError('تم إغلاق نافذة تسجيل الدخول')
      else if (code === 'auth/popup-blocked')
        setError('المتصفح يحجب النافذة المنبثقة. اسمح بالنوافذ المنبثقة وحاول مرة أخرى.')
      else setError('فشل تسجيل الدخول: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  // Use the live store logo, or fall back to a procedural monogram.
  const storeLogo = store?.logo || generateStoreLogo({ name: store?.name || '?', shape: 'square', size: { width: 96, height: 96 } })

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" dir="rtl">
      <aside
        className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-soft) 60%, var(--color-accent) 130%)',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {storeLogo ? (
              <img
                src={storeLogo}
                alt={store?.name || 'المتجر'}
                className="w-14 h-14 rounded-2xl object-cover bg-white/20 ring-2 ring-white/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Store size={28} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold leading-tight">{store?.name || 'المنصة'}</h1>
              {store?.description && (
                <p className="text-sm opacity-80 mt-0.5">{store.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            لوحة تحكم
            <br />
            <span className="opacity-90">المتجر الذكي</span>
          </h2>
          <p className="text-base xl:text-lg opacity-85 leading-relaxed max-w-md">
            أدر منتجاتك، طلباتك، إعداداتك وكل ما يخص متجرك من مكان واحد.
          </p>
          <div className="flex items-center gap-2 text-sm opacity-75">
            <ShieldCheck size={18} />
            <span>تسجيل دخول آمن عبر حسابك في Google</span>
          </div>
        </div>

        <div className="relative z-10 text-sm opacity-60">
          © {new Date().getFullYear()} {store?.name || 'المنصة'} — جميع الحقوق محفوظة
        </div>

        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'var(--color-accent)' }}
        />
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--color-surface-elevated)' }}
        />
      </aside>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            {storeLogo ? (
              <img src={storeLogo} alt="" className="w-12 h-12 rounded-xl object-cover bg-surface" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Store size={24} />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-ink">{store?.name || 'المنصة'}</h1>
              <p className="text-xs text-muted">لوحة التحكم</p>
            </div>
          </div>

          <div className="bg-surface-elevated rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-ink">تسجيل دخول المسؤول</h2>
              <p className="text-sm text-muted mt-1.5">
                سجّل دخولك عبر Google للوصول إلى لوحة التحكم
              </p>
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
              className="w-full flex items-center justify-center gap-3 bg-surface-elevated border-2 border-border text-ink py-3 rounded-xl font-semibold hover:bg-surface hover:border-primary/40 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  جاري التحويل...
                </span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                  <span>تسجيل الدخول عبر Google</span>
                </>
              )}
            </button>

            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted">
                ليس لديك متجر بعد؟{' '}
                <Link
                  to="/admin/signup"
                  className="text-primary hover:opacity-80 font-semibold inline-flex items-center gap-0.5"
                >
                  أنشئ متجراً جديداً
                  <ChevronLeft size={14} />
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition"
            >
              <ArrowLeft size={16} />
              العودة إلى المتجر
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
