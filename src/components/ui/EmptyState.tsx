import { type ReactNode } from 'react'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-12 px-4"
      dir="rtl"
    >
      <div className="mb-4 text-muted/40">
        {icon || <PackageOpen className="w-16 h-16" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-muted text-sm mb-6 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
