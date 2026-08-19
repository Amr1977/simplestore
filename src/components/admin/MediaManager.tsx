import { useRef } from 'react'
import { Upload, Image as ImageIcon, Video, Trash2, ChevronUp, ChevronDown, Star } from 'lucide-react'
import type { ProductMedia } from '@/types'

interface MediaManagerProps {
  media: ProductMedia[]
  onChange: (media: ProductMedia[]) => void
  onUpload: (files: FileList | null) => void
  onRemove: (id: string) => void
}

export default function MediaManager({ media, onChange, onUpload, onRemove }: MediaManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          صورة
        </button>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Video className="w-4 h-4" />
          فيديو
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => onUpload(e.target.files)}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => onUpload(e.target.files)}
        />
      </div>

      {media.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
          لا توجد ملفات مرفوعة
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group"
            >
              {item.type === 'video' ? (
                <video src={item.secureUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={item.thumbnailUrl || item.secureUrl} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => move(index, -1)} className="p-1.5 bg-white rounded-full hover:bg-gray-100">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="p-1.5 bg-white rounded-full hover:bg-gray-100">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setPrimary(item.id)} className="p-1.5 bg-white rounded-full hover:bg-gray-100">
                  <Star className="w-4 h-4 text-amber-500" />
                </button>
                <button type="button" onClick={() => onRemove(item.id)} className="p-1.5 bg-white rounded-full hover:bg-gray-100">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute top-1 right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">أساسي</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
