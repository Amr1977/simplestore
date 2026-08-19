import { useState, useEffect } from 'react'
import { updateStore } from '@/firebase/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useStore } from '@/features/store'
import type { StoreTheme, DeliveryConfig, OpeningHours } from '@/types'

const themePresets = [
  { name: 'أخضر', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' },
  { name: 'أزرق', primary: '#2563eb', secondary: '#1d4ed8', accent: '#f59e0b' },
  { name: 'برتقالي', primary: '#f97316', secondary: '#ea580c', accent: '#16a34a' },
]

export default function SettingsPage() {
  const { store } = useStore()
  const [form, setForm] = useState({
    name: store?.name || '',
    description: store?.description || '',
    whatsappNumber: store?.whatsappNumber || '',
    phone: store?.phone || '',
    address: store?.address || '',
  })
  const [logo, setLogo] = useState(store?.logo || '')
  const [banner, setBanner] = useState(store?.banner || '')
  const [theme, setTheme] = useState<StoreTheme>(store?.theme || { preset: 'green', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' })
  const [delivery, setDelivery] = useState<DeliveryConfig>(store?.delivery || { enabled: true, fee: 10, minimumOrder: 50, freeDeliveryThreshold: 200 })
  const [hours, setHours] = useState<OpeningHours>(store?.openingHours || {})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const defaultHours: OpeningHours = {
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '23:00' },
      monday: { open: '08:00', close: '23:00' },
      tuesday: { open: '08:00', close: '23:00' },
      wednesday: { open: '08:00', close: '23:00' },
      thursday: { open: '08:00', close: '23:00' },
      friday: { open: '08:00', close: '23:00' },
    }
    setHours(prev => ({ ...defaultHours, ...prev }))
  }, [])

  const handleUpload = async (file: File, type: 'logo' | 'banner') => {
    const result = await uploadToCloudinary(file, `stores/${store?.id || 'abu-qir-demo'}`)
    if (type === 'logo') setLogo(result.secureUrl)
    else setBanner(result.secureUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const data = {
      name: form.name,
      description: form.description,
      logo,
      banner,
      whatsappNumber: form.whatsappNumber,
      phone: form.phone,
      address: form.address,
      theme,
      delivery,
      openingHours: hours,
    }
    await updateStore(store?.id || 'abu-qir-demo', data)
    setMessage('تم حفظ الإعدادات بنجاح')
    setSaving(false)
  }

  const dayLabels: Record<string, string> = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{message}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">معلومات المتجر</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر *</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب</label>
          <input type="text" value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
          <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
          <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">الشعار والبانر</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشعار</label>
            <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'logo') }} className="text-sm" />
            {logo && <img src={logo} alt="Logo" className="mt-2 w-16 h-16 object-cover rounded-lg border border-gray-200" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البانر</label>
            <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], 'banner') }} className="text-sm" />
            {banner && <img src={banner} alt="Banner" className="mt-2 w-full h-24 object-cover rounded-lg border border-gray-200" />}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">السمة</h3>
        <div className="flex gap-3">
          {themePresets.map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setTheme({ preset: preset.name.toLowerCase(), primary: preset.primary, secondary: preset.secondary, accent: preset.accent })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${theme.preset === preset.name.toLowerCase() ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'}`}
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          {(['primary', 'secondary', 'accent'] as const).map(key => (
            <div key={key} className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
              <input type="color" value={theme[key]} onChange={e => setTheme({ ...theme, [key]: e.target.value })} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
            </div>
          ))}
        </div>
        <div className="h-12 rounded-lg border border-gray-200" style={{ backgroundColor: theme.primary }} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">إعدادات التوصيل</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={delivery.enabled} onChange={e => setDelivery({ ...delivery, enabled: e.target.checked })} className="rounded text-green-600 focus:ring-green-500" />
          <span className="text-sm text-gray-700">تفعيل التوصيل</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رسوم التوصيل</label>
            <input type="number" min="0" value={delivery.fee} onChange={e => setDelivery({ ...delivery, fee: parseFloat(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأدنى للطلب</label>
            <input type="number" min="0" value={delivery.minimumOrder} onChange={e => setDelivery({ ...delivery, minimumOrder: parseFloat(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توصيل مجاني من</label>
            <input type="number" min="0" value={delivery.freeDeliveryThreshold ?? ''} onChange={e => setDelivery({ ...delivery, freeDeliveryThreshold: e.target.value ? parseFloat(e.target.value) : null })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="اختياري" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-gray-900">ساعات العمل</h3>
        {Object.entries(hours).map(([day, config]) => (
          <div key={day} className="grid grid-cols-3 gap-3 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!config.closed}
                onChange={e => setHours({ ...hours, [day]: { ...config, closed: !e.target.checked } })}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{dayLabels[day] || day}</span>
            </label>
            {!config.closed ? (
              <>
                <input type="time" value={config.open} onChange={e => setHours({ ...hours, [day]: { ...config, open: e.target.value } })} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="time" value={config.close} onChange={e => setHours({ ...hours, [day]: { ...config, close: e.target.value } })} className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </>
            ) : (
              <span className="text-sm text-gray-400 col-span-2">مغلق</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </form>
  )
}
