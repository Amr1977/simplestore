import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import type { ProductMedia } from '@/types'

interface ProductGalleryProps {
  media: ProductMedia[]
  productName: string
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentMedia = media[currentIndex]

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= media.length) return
    setCurrentIndex(index)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.load()
    }
    setIsPlaying(false)
  }, [media.length])

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % media.length)
  }, [currentIndex, goTo])

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + media.length) % media.length)
  }, [currentIndex, media.length, goTo])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    setTouchStart(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goNext()
      if (e.key === 'ArrowRight') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="space-y-3">
      <div
        className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.secureUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentMedia.secureUrl}
              poster={currentMedia.thumbnailUrl || currentMedia.secureUrl}
              className="w-full h-full object-cover"
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
              aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
            >
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:bg-white transition">
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="mr-[-2px]" />}
              </div>
            </button>
          </div>
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition"
              aria-label="السابق"
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition"
              aria-label="التالي"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}

        {media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`صورة ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {media.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(idx)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${idx === currentIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img
                src={item.type === 'video' ? item.thumbnailUrl || item.secureUrl : item.secureUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
