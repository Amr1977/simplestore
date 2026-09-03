import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { createStore, createUserProfile } from '@/firebase/firestore'
import { generateStoreLogo } from '@/lib/storeLogo'

const THEME_PRESETS = [
  { name: 'أخضر ترابي', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' },
  { name: 'تراكوتا', primary: '#b04a2f', secondary: '#8a3a26', accent: '#d4a04a' },
  { name: 'أزرق ليلي', primary: '#1e3a5f', secondary: '#152a45', accent: '#d4a04a' },
  { name: 'بنفسجي', primary: '#5b3a7a', secondary: '#422a5a', accent: '#d4a04a' },
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
  const { signUp, user } = useAuth()
  const [form, setForm] = useState({
    storeName: '',
    storeSlug: '',
    description: '',
    phone: '',
    address: '',
    whatsappNumber: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    themePreset: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">أنت مسجّل دخول بالفعل</h1>
          <p className="text-sm text-gray-600 mb-4">يجب تسجيل الخروج قبل إنشاء متجر جديد.</p>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            العودة إلى لوحة التحكم
          </button>
        </div>
      </div>
    )
  }

  const updateField = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'storeName' && typeof value === 'string') {
      setForm(prev => ({ ...prev, storeName: value, storeSlug: slugifyArabic(value) }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.adminPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    if (form.adminPassword !== form.adminPasswordConfirm) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    if (!form.storeSlug.match(/^[a-z0-9-]+$/)) {
      setError('رابط المتجر يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط')
      return
    }

    setLoading(true)
    try {
      const storeId = generateStoreId()
      const preset = THEME_PRESETS[form.themePreset]
      const newUser = await signUp(form.adminEmail, form.adminPassword)

      await createStore(storeId, {
        name: form.storeName,
        slug: form.storeSlug,
        description: form.description || 'متجر جديد',
        logo: generateStoreLogo({ name: form.storeName, shape: 'square' }),
        banner: generateStoreLogo({ name: form.storeName, shape: 'banner' }),
        whatsappNumber: form.whatsappNumber,
        phone: form.phone,
        address: form.address,
        theme: { preset: ['green', 'terracotta', 'navy', 'purple'][form.themePreset], ...preset },
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

      await createUserProfile(newUser.uid, {
        email: form.adminEmail,
        role: 'vendor',
        storeId,
      })

      navigate('/admin')
    } catch (err: any) {
      const code = err?.code || ''
      if (code === 'auth/email-already-in-use') setError('هذا البريد مستخدم بالفعل')
      else if (code === 'auth/invalid-email') setError('البريد الإلكتروني غير صالح')
      else if (code === 'auth/weak-password') setError('كلمة المرور ضعيفة')
      else setError('فشل إنشاء المتجر: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">إنشاء متجر جديد</h1>
          <p className="text-sm text-gray-600 mt-1">أنشئ متجرك وأضف أول مسؤول له.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
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

          <fieldset className="space-y-4 pt-4 border-t border-gray-200">
            <legend className="text-sm font-semibold text-gray-900 mb-2">بيانات المسؤول</legend>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={e => updateField('adminEmail', e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="admin@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={form.adminPassword}
                  onChange={e => updateField('adminPassword', e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={form.adminPasswordConfirm}
                  onChange={e => updateField('adminPasswordConfirm', e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
