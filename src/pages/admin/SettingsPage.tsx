import { useState, useEffect, useRef, type FormEvent } from 'react'
import { updateStore } from '@/firebase/firestore'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useStore } from '@/features/store'
import { generateStoreLogo } from '@/lib/storeLogo'
import type { StoreTheme, DeliveryConfig, OpeningHours } from '@/types'
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Link as LinkIcon,
  AlertCircle,
  Save,
  Palette,
  Truck,
  Clock,
  Store as StoreIcon,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react'

const themePresets = [
  { name: 'أخضر', preset: 'green', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' },
  { name: 'تراكوتا', preset: 'terracotta', primary: '#b04a2f', secondary: '#8a3a26', accent: '#d4a04a' },
  { name: 'أزرق', preset: 'blue', primary: '#2563eb', secondary: '#1d4ed8', accent: '#f59e0b' },
  { name: 'بنفسجي', preset: 'purple', primary: '#5b3a7a', secondary: '#422a5a', accent: '#d4a04a' },
]

const DAYS: { key: keyof OpeningHours; label: string }[] = [
  { key: 'saturday', label: 'السبت' },
  { key: 'sunday', label: 'الأحد' },
  { key: 'monday', label: 'الاثنين' },
  { key: 'tuesday', label: 'الثلاثاء' },
  { key: 'wednesday', label: 'الأربعاء' },
  { key: 'thursday', label: 'الخميس' },
  { key: 'friday', label: 'الجمعة' },
]

const DEFAULT_HOURS: OpeningHours = {
  saturday: { open: '08:00', close: '23:00' },
  sunday: { open: '08:00', close: '23:00' },
  monday: { open: '08:00', close: '23:00' },
  tuesday: { open: '08:00', close: '23:00' },
  wednesday: { open: '08:00', close: '23:00' },
  thursday: { open: '08:00', close: '23:00' },
  friday: { open: '08:00', close: '23:00' },
}

export default function SettingsPage() {
  const { store, refresh } = useStore()
  const [form, setForm] = useState({
    name: store?.name || '',
    description: store?.description || '',
    whatsappNumber: store?.whatsappNumber || '',
    phone: store?.phone || '',
    address: store?.address || '',
  })
  const [logo, setLogo] = useState(store?.logo || '')
  const [banner, setBanner] = useState(store?.banner || '')
  const [theme, setTheme] = useState<StoreTheme>(
    store?.theme || { preset: 'green', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' }
  )
  const [delivery, setDelivery] = useState<DeliveryConfig>(
    store?.delivery || { enabled: true, fee: 10, minimumOrder: 50, freeDeliveryThreshold: 200 }
  )
  const [hours, setHours] = useState<OpeningHours>({ ...DEFAULT_HOURS, ...(store?.openingHours || {}) })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [logoUrlInputOpen, setLogoUrlInputOpen] = useState(false)
  const [bannerUrlInputOpen, setBannerUrlInputOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Re-sync local state when the store loads/changes.
  useEffect(() => {
    if (!store) return
    setForm({
      name: store.name || '',
      description: store.description || '',
      whatsappNumber: store.whatsappNumber || '',
      phone: store.phone || '',
      address: store.address || '',
    })
    setLogo(store.logo || '')
    setBanner(store.banner || '')
    setTheme(
      store.theme || { preset: 'green', primary: '#16a34a', secondary: '#15803d', accent: '#f59e0b' }
    )
    setDelivery(
      store.delivery || { enabled: true, fee: 10, minimumOrder: 50, freeDeliveryThreshold: 200 }
    )
    setHours({ ...DEFAULT_HOURS, ...(store.openingHours || {}) })
  }, [store?.id])

  if (!store) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    if (type === 'logo') setUploadingLogo(true)
    else setUploadingBanner(true)
    try {
      const result = await uploadToCloudinary(file, `stores/${store.id}`)
      if (type === 'logo') setLogo(result.secureUrl)
      else setBanner(result.secureUrl)
    } catch (err: any) {
      setUploadError(err?.message || 'فشل رفع الصورة. جرّب إضافة برابط بدلاً من ذلك.')
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      else setUploadingBanner(false)
      // Clear the input so the same file can be re-selected
      e.target.value = ''
    }
  }

  const handleUrlAdd = (type: 'logo' | 'banner') => {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setUploadError('الرابط يجب أن يبدأ بـ http:// أو https://')
      return
    }
    if (type === 'logo') setLogo(url)
    else setBanner(url)
    setUrlInput('')
    if (type === 'logo') setLogoUrlInputOpen(false)
    else setBannerUrlInputOpen(false)
    setUploadError('')
  }

  const resetToProcedural = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogo(generateStoreLogo({ name: form.name || store.name, shape: 'square' }))
    } else {
      setBanner(generateStoreLogo({ name: form.name || store.name, shape: 'banner' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        logo: logo.trim(),
        banner: banner.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        theme,
        delivery: {
          ...delivery,
          freeDeliveryThreshold:
            delivery.freeDeliveryThreshold === null || delivery.freeDeliveryThreshold === undefined
              ? null
              : Number(delivery.freeDeliveryThreshold),
        },
        openingHours: hours,
      }
      await updateStore(store.id, data)
      await refresh?.()
      setSaved(true)
      // Auto-hide the success banner after 3s
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Settings save failed', err)
      setError('فشل حفظ الإعدادات: ' + (err?.message || 'خطأ غير معروف'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-3xl">
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Store info */}
      <Section icon={StoreIcon} title="معلومات المتجر">
        <Field label="اسم المتجر" required>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </Field>
        <Field label="الوصف">
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="رقم الواتساب" hint="مع كود الدولة بدون +">
            <input
              type="tel"
              value={form.whatsappNumber}
              onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
              dir="ltr"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="201234567890"
            />
          </Field>
          <Field label="الهاتف">
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              dir="ltr"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="03-1234567"
            />
          </Field>
        </div>
        <Field label="العنوان">
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </Field>
      </Section>

      {/* Logo & Banner */}
      <Section icon={ImageIcon} title="الشعار والبانر">
        {uploadError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">فشل رفع الصورة</p>
              <p className="text-xs mt-0.5 opacity-80">{uploadError}</p>
            </div>
            <button type="button" onClick={() => setUploadError('')} className="p-1 hover:bg-red-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MediaField
            label="الشعار"
            shape="square"
            value={logo}
            uploading={uploadingLogo}
            urlInputOpen={logoUrlInputOpen}
            urlInput={urlInput}
            onUrlInputChange={setUrlInput}
            onOpenUrl={() => {
              setLogoUrlInputOpen(true)
              setBannerUrlInputOpen(false)
            }}
            onCloseUrl={() => setLogoUrlInputOpen(false)}
            onAddUrl={() => handleUrlAdd('logo')}
            onPickFile={() => logoInputRef.current?.click()}
            onResetProcedural={() => resetToProcedural('logo')}
            inputRef={logoInputRef}
            onFileChange={e => handleFileUpload(e, 'logo')}
          />
          <MediaField
            label="البانر"
            shape="banner"
            value={banner}
            uploading={uploadingBanner}
            urlInputOpen={bannerUrlInputOpen}
            urlInput={urlInput}
            onUrlInputChange={setUrlInput}
            onOpenUrl={() => {
              setBannerUrlInputOpen(true)
              setLogoUrlInputOpen(false)
            }}
            onCloseUrl={() => setBannerUrlInputOpen(false)}
            onAddUrl={() => handleUrlAdd('banner')}
            onPickFile={() => bannerInputRef.current?.click()}
            onResetProcedural={() => resetToProcedural('banner')}
            inputRef={bannerInputRef}
            onFileChange={e => handleFileUpload(e, 'banner')}
          />
        </div>
      </Section>

      {/* Theme */}
      <Section icon={Palette} title="السمة اللونية">
        <div>
          <p className="text-xs font-semibold text-muted mb-2">القوالب الجاهزة</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {themePresets.map(preset => (
              <button
                key={preset.preset}
                type="button"
                onClick={() =>
                  setTheme({
                    preset: preset.preset,
                    primary: preset.primary,
                    secondary: preset.secondary,
                    accent: preset.accent,
                  })
                }
                className={`p-3 rounded-lg border-2 transition ${
                  theme.preset === preset.preset
                    ? 'border-ink ring-2 ring-offset-1 ring-ink'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: preset.primary, color: 'white' }}
              >
                <div className="text-sm font-bold">{preset.name}</div>
                <div className="flex gap-1 mt-1.5 justify-center">
                  <div className="w-4 h-4 rounded-full ring-1 ring-white/30" style={{ backgroundColor: preset.secondary }} />
                  <div className="w-4 h-4 rounded-full ring-1 ring-white/30" style={{ backgroundColor: preset.accent }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted mb-2">تخصيص الألوان</p>
          <div className="grid grid-cols-3 gap-3">
            {(['primary', 'secondary', 'accent'] as const).map(key => (
              <div key={key}>
                <label className="block text-xs text-muted mb-1 capitalize">
                  {key === 'primary' ? 'الأساسي' : key === 'secondary' ? 'الثانوي' : 'التمييز'}
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated p-1.5">
                  <input
                    type="color"
                    value={theme[key]}
                    onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={theme[key]}
                    onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                    dir="ltr"
                    className="flex-1 min-w-0 bg-transparent text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="h-14 rounded-lg border border-border flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: theme.primary, color: 'white' }}
        >
          معاينة اللون الأساسي
        </div>
      </Section>

      {/* Delivery */}
      <Section icon={Truck} title="إعدادات التوصيل">
        <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-border bg-surface">
          <input
            type="checkbox"
            checked={delivery.enabled}
            onChange={e => setDelivery({ ...delivery, enabled: e.target.checked })}
            className="rounded text-primary focus:ring-primary/40 w-4 h-4"
          />
          <span className="text-sm font-medium text-ink">تفعيل التوصيل</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="رسوم التوصيل (ج.م)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={delivery.fee}
              onChange={e =>
                setDelivery({ ...delivery, fee: parseFloat(e.target.value) || 0 })
              }
              disabled={!delivery.enabled}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
            />
          </Field>
          <Field label="الحد الأدنى للطلب (ج.م)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={delivery.minimumOrder}
              onChange={e =>
                setDelivery({ ...delivery, minimumOrder: parseFloat(e.target.value) || 0 })
              }
              disabled={!delivery.enabled}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
            />
          </Field>
          <Field label="توصيل مجاني من (ج.م)" hint="اتركه فارغاً لتعطيل">
            <input
              type="number"
              min="0"
              step="0.01"
              value={delivery.freeDeliveryThreshold ?? ''}
              onChange={e =>
                setDelivery({
                  ...delivery,
                  freeDeliveryThreshold: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                })
              }
              disabled={!delivery.enabled}
              placeholder="اختياري"
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
            />
          </Field>
        </div>
      </Section>

      {/* Opening hours */}
      <Section icon={Clock} title="ساعات العمل">
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const day = (hours as any)[key] || { open: '08:00', close: '23:00' }
            const closed = !!day.closed
            return (
              <div
                key={key}
                className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[120px_1fr_1fr] items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-border bg-surface"
              >
                <label className="flex items-center gap-2 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    checked={!closed}
                    onChange={e =>
                      setHours({ ...hours, [key]: { ...day, closed: !e.target.checked } })
                    }
                    className="rounded text-primary focus:ring-primary/40 w-4 h-4 shrink-0"
                  />
                  <span className="text-sm font-medium text-ink truncate">{label}</span>
                </label>
                {!closed ? (
                  <>
                    <input
                      type="time"
                      value={day.open}
                      onChange={e => setHours({ ...hours, [key]: { ...day, open: e.target.value } })}
                      className="rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                    <input
                      type="time"
                      value={day.close}
                      onChange={e => setHours({ ...hours, [key]: { ...day, close: e.target.value } })}
                      className="rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </>
                ) : (
                  <span className="text-sm text-muted col-span-2 sm:col-span-2 text-center">مغلق</span>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      <div className="flex flex-col sm:flex-row gap-3 sticky bottom-16 md:bottom-0 bg-surface py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 border-t border-border z-30">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition shadow-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface-elevated border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h2 className="font-bold text-ink flex items-center gap-2">
        <Icon size={18} className="text-primary" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  )
}

function MediaField({
  label,
  shape,
  value,
  uploading,
  urlInputOpen,
  urlInput,
  onUrlInputChange,
  onOpenUrl,
  onCloseUrl,
  onAddUrl,
  onPickFile,
  onResetProcedural,
  inputRef,
  onFileChange,
}: {
  label: string
  shape: 'square' | 'banner'
  value: string
  uploading: boolean
  urlInputOpen: boolean
  urlInput: string
  onUrlInputChange: (v: string) => void
  onOpenUrl: () => void
  onCloseUrl: () => void
  onAddUrl: () => void
  onPickFile: () => void
  onResetProcedural: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const isSquare = shape === 'square'
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      <div
        className={`relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-surface mb-2 ${
          isSquare ? 'aspect-square max-w-[160px]' : 'aspect-[16/6]'
        }`}
      >
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted text-xs gap-1">
            <ImageIcon className="w-6 h-6" />
            <span>لا توجد صورة</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onPickFile}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-surface text-xs font-semibold text-ink hover:bg-surface-elevated disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? 'جاري الرفع...' : 'رفع'}
        </button>
        <button
          type="button"
          onClick={urlInputOpen ? onCloseUrl : onOpenUrl}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-surface text-xs font-semibold text-ink hover:bg-surface-elevated"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          رابط
        </button>
        <button
          type="button"
          onClick={onResetProcedural}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-surface text-xs font-semibold text-muted hover:bg-surface-elevated"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة تعيين
        </button>
      </div>

      {urlInputOpen && (
        <div className="flex items-center gap-1.5 mt-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => onUrlInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onAddUrl()
              }
            }}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="flex-1 rounded-md border border-border bg-surface-elevated px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={onAddUrl}
            className="px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
          >
            إضافة
          </button>
          <button
            type="button"
            onClick={onCloseUrl}
            className="p-1.5 rounded-md hover:bg-surface text-muted"
            aria-label="إلغاء"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}
