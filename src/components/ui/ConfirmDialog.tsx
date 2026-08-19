import { useEffect, useCallback } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  danger = false,
}: ConfirmDialogProps) {
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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-surface rounded-xl shadow-xl w-full max-w-sm z-10"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <div className="p-5">
          <h3
            id="confirm-dialog-title"
            className="text-lg font-semibold text-text mb-2"
          >
            {title}
          </h3>
          <p
            id="confirm-dialog-message"
            className="text-muted text-sm leading-relaxed"
          >
            {message}
          </p>
        </div>
        <div className="flex gap-2 p-5 pt-0">
          <button
            onClick={onConfirm}
            className={`
              flex-1 py-2.5 rounded-lg font-medium
              transition-colors duration-200
              ${danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary text-white hover:bg-secondary'
              }
            `}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="
              flex-1 py-2.5 rounded-lg font-medium
              border border-border text-text
              hover:bg-gray-50
              transition-colors duration-200
            "
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
