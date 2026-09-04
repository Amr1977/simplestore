import { useRef, useState } from 'react'
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react'
import type { ProductMedia } from '@/types'

interface MediaManagerProps {
  media: ProductMedia[]
  onChange: (media: ProductMedia[]) => void
  onUpload: (files: FileList | null) => Promise<void> | void
  onRemove: (id: string) => void
}

export default function MediaManager({ media, onChange, onUpload, onRemove }: MediaManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInputOpen, setUrlInputOpen] = useState(false)
  const [urlValue, setUrlValue] = useState('')

  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= media.length) return
    const updated = [...media]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    updated.forEach((m, i) => (m.sortOrder = i))
    onChange(updated)
  }

  const setPrimary = (id: string) => {
    const updated = media.map(m => ({ ...m, sortOrder: m.id === id ? 0 : m.sortOrder + 1 }))
    updated.sort((a, b) => a.sortOrder - b.sortOrder)
    updated.forEach((m, i) => (m.sortOrder = i))
    onChange(updated)
  }

  const handleFilePick = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    try {
      await onUpload(files)
    } catch (e: any) {
      setError(e?.message || 'فشل رفع الصورة. تحقق من اتصال الإنترنت أو استخدم رابط URL.')
    } finally {
      setUploading(false)
    }
  }

  const addByUrl = () => {
    const url = urlValue.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setError('الرابط يجب أن يبدأ بـ http:// أو https://')
      return
    }
    setError('')
    const newItem: ProductMedia = {
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'image',
      publicId: url,
      secureUrl: url,
      thumbnailUrl: url,
      width: 0,
      height: 0,
      sortOrder: media.length,
    }
    onChange([...media, newItem])
    setUrlValue('')
    setUrlInputOpen(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-ink text-sm font-medium hover:bg-surface transition disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          {uploading ? 'جاري الرفع...' : 'رفع صورة'}
        </button>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-ink text-sm font-medium hover:bg-surface transition disabled:opacity-50"
        >
          <Video className="w-4 h-4" />
          فيديو
        </button>
        <button
          type="button"
          onClick={() => setUrlInputOpen(v => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-ink text-sm font-medium hover:bg-surface transition"
        >
          <LinkIcon className="w-4 h-4" />
          إضافة برابط
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFilePick(e.target.files)}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => handleFilePick(e.target.files)}
        />
      </div>

      {urlInputOpen && (
        <div className="flex items-center gap-2 p-2 bg-surface border border-border rounded-lg">
          <input
            type="url"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addByUrl()
              }
            }}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="flex-1 px-3 py-2 rounded-md border border-border bg-surface-elevated text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={addByUrl}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
          >
            إضافة
          </button>
          <button
            type="button"
            onClick={() => {
              setUrlInputOpen(false)
              setUrlValue('')
            }}
            className="p-2 rounded-md hover:bg-surface text-muted"
            aria-label="إلغاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">فشل رفع الصورة</p>
            <p className="text-xs mt-0.5 opacity-80">{error}</p>
          </div>
          <button type="button" onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {media.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted text-sm">
          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-ink">لا توجد ملفات مرفوعة</p>
          <p className="text-xs mt-1">ارفع صورة، أضف فيديو، أو الصق رابط URL</p>
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted mb-2">
            اضغط على صورة لجعلها الأساسية. استخدم الأزرار للترتيب أو الحذف.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item, index) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-surface border-2 border-border group"
              >
                {item.type === 'video' ? (
                  <video src={item.secureUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img
                    src={item.thumbnailUrl || item.secureUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => {
                      const el = e.currentTarget
                      if (el.dataset.fallback === '1') return
                      el.dataset.fallback = '1'
                      el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="10" fill="#9ca3af">تعذر التحميل</text></svg>'
                      )
                    }}
                  />
                )}
                {index === 0 && (
                  <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-3 h-3" fill="currentColor" />
                    أساسية
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="absolute top-1 left-1 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
                  title="حذف"
                  aria-label="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 flex items-center justify-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => setPrimary(item.id)}
                      className="p-1.5 bg-amber-500 text-white rounded-full hover:bg-amber-600"
                      title="اجعلها أساسية"
                      aria-label="اجعلها أساسية"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 bg-white text-ink rounded-full hover:bg-gray-100 disabled:opacity-30"
                    title="رفع"
                    aria-label="رفع"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === media.length - 1}
                    className="p-1.5 bg-white text-ink rounded-full hover:bg-gray-100 disabled:opacity-30"
                    title="إنزال"
                    aria-label="إنزال"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
