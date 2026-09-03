import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { createStore, createUserProfile } from '@/firebase/firestore'
import { generateStoreLogo } from '@/lib/storeLogo'

const THEME_PRESETS = [
  { name: 'أخضر ترابي', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b', preset: 'green' },
  { name: 'تراكوتا', primary: '#b04a2f', secondary: '#8a3a26', accent: '#d4a04a', preset: 'terracotta' },
  { name: 'أزرق ليلي', primary: '#1e3a5f', secondary: '#152a45', accent: '#d4a04a', preset: 'navy' },
  { name: 'بنفسجي', primary: '#5b3a7a', secondary: '#422a5a', accent: '#d4a04a', preset: 'purple' },
]

function slugifyArabic(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
    .toLowerCase()
}

function generateStoreId(): string {
  return 'store-' + Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36)
}

export default function StoreSignupPage() {
  const navigate = useNavigate()
  const { user, loginWithGoogle, logout } = useAuth()
  const [form, setForm] = useState({
    storeName: '',
    storeSlug: '',
    description: '',
    phone: '',
    address: '',
    whatsappNumber: '',
    themePreset: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'google' | 'details'>(user ? 'details' : 'google')

  const updateField = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'storeName' && typeof value === 'string') {
      setForm(prev => ({ ...prev, storeName: value, storeSlug: slugifyArabic(value) }))
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      setStep('details')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/popup-closed-by-user') setError('تم إغلاق نافذة تسجيل الدخول')
      else if (code === 'auth/popup-blocked') setError('المتصفح يحجب النافذة المنبثقة')
      else setError('فشل تسجيل الدخول: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('يجب تسجيل الدخول عبر Google أولاً')
      return
    }
    setError('')

    if (!form.storeSlug.match(/^[a-z0-9-]+$/)) {
      setError('رابط المتجر يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط')
      return
    }
    if (!form.storeName.trim()) {
      setError('اسم المتجر مطلوب')
      return
    }

    setLoading(true)
    try {
      const storeId = generateStoreId()
      const preset = THEME_PRESETS[form.themePreset]
      await createStore(storeId, {
        name: form.storeName,
        slug: form.storeSlug,
        description: form.description || 'متجر جديد',
        logo: generateStoreLogo({ name: form.storeName, shape: 'square' }),
        banner: generateStoreLogo({ name: form.storeName, shape: 'banner' }),
        whatsappNumber: form.whatsappNumber,
        phone: form.phone,
        address: form.address,
        theme: { preset: preset.preset, primary: preset.primary, secondary: preset.secondary, accent: preset.accent },
        delivery: { enabled: true, fee: 10, minimumOrder: 50, freeDeliveryThreshold: 200 },
        openingHours: {
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '08:00', close: '23:00' },
          monday: { open: '08:00', close: '23:00' },
          tuesday: { open: '08:00', close: '23:00' },
          wednesday: { open: '08:00', close: '23:00' },
          thursday: { open: '08:00', close: '23:00' },
          friday: { open: '08:00', close: '23:00' },
        },
        active: true,
      })

      await createUserProfile(user.uid, {
        email: user.email || '',
        role: 'vendor',
        storeId,
      })

      navigate('/admin')
    } catch (err: any) {
      setError('فشل إنشاء المتجر: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  if (user && step === 'details') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إنشاء متجر جديد</h1>
              <p className="text-sm text-gray-600 mt-1">
                مُسجَّل الدخول: <span className="font-medium" dir="ltr">{user.email}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              تسجيل الخروج
            </button>
          </div>

          <form onSubmit={handleCreate} className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-gray-900 mb-2">بيانات المتجر</legend>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={e => updateField('storeName', e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="بقالة أبو قير"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط المتجر (slug)</label>
                <div className="flex items-stretch" dir="ltr">
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">simplestore77.web.app/</span>
                  <input
                    type="text"
                    value={form.storeSlug}
                    onChange={e => updateField('storeSlug', e.target.value)}
                    required
                    className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="abu-qir-grocery"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف قصير</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="كل احتياجات البيت في مكان واحد"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="03-1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم واتساب</label>
                  <input
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={e => updateField('whatsappNumber', e.target.value)}
                    required
                    dir="ltr"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="201234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="أبو قير - الإسكندرية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">لون المتجر</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEME_PRESETS.map((preset, i) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => updateField('themePreset', i)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.themePreset === i ? 'border-gray-900 ring-2 ring-offset-1 ring-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: preset.primary, color: 'white' }}
                    >
                      <div className="text-sm font-bold">{preset.name}</div>
                      <div className="flex gap-1 mt-1.5 justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="px-4 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                لديّ حساب
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">إنشاء متجر جديد</h1>
          <p className="text-sm text-gray-600 mt-1">ابدأ بتسجيل الدخول عبر Google</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
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
              <span>متابعة عبر Google</span>
            </>
          )}
        </button>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <a href="/admin/login" className="text-green-600 hover:text-green-700 font-medium">
              تسجيل الدخول
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
