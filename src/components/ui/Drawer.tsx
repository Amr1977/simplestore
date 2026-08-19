import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  side?: 'right' | 'left'
}

export function Drawer({ isOpen, onClose, title, children, side = 'right' }: DrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  const isRtlSide = side === 'right'

  return (
    <div dir="rtl">
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className={`
              fixed top-0 bottom-0 z-50
              bg-surface shadow-xl
              transition-transform duration-300 ease-in-out
              flex flex-col
              ${isRtlSide ? 'right-0 rounded-l-xl' : 'left-0 rounded-r-xl'}
              ${isOpen ? 'translate-x-0' : isRtlSide ? 'translate-x-full' : '-translate-x-full'}
              w-full max-w-md
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h2 id="drawer-title" className="text-lg font-semibold text-text">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </>
      )}
    </div>
  )
}
