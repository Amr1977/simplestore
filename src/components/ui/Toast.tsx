import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
}

const typeConfig: Record<ToastType, { icon: React.ElementType; className: string }> = {
  success: { icon: CheckCircle, className: 'text-green-600 bg-green-50 border-green-200' },
  error: { icon: XCircle, className: 'text-red-600 bg-red-50 border-red-200' },
  warning: { icon: AlertCircle, className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  info: { icon: Info, className: 'text-blue-600 bg-blue-50 border-blue-200' },
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10)
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 300)
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [onClose])

  if (!isVisible) return null

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      dir="rtl"
      className={`
        fixed top-4 left-4 z-50
        flex items-center gap-3 px-4 py-3
        rounded-lg border shadow-lg
        min-w-[280px] max-w-sm
        transition-all duration-300
        ${config.className}
        ${isLeaving ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'}
      `}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium text-text">{message}</p>
      <button
        onClick={() => {
          setIsLeaving(true)
          setTimeout(() => {
            setIsVisible(false)
            onClose()
          }, 300)
        }}
        className="p-0.5 rounded hover:bg-black/5 transition-colors"
        aria-label="إغلاق الإشعار"
      >
        <X className="w-4 h-4 text-muted" />
      </button>
    </div>
  )
}
