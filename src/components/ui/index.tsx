import { PackageOpen } from 'lucide-react'

interface LoadingStateProps {
  count?: number
  className?: string
}

export function LoadingState({ count = 6, className = '' }: LoadingStateProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-3 animate-pulse">
          <div className="aspect-square rounded-lg bg-gray-100 mb-2" />
          <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title = 'لا يوجد عناصر', description = 'لم يتم العثور على أي عناصر حالياً', icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon ?? <PackageOpen size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors duration-200">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ title = 'حدث خطأ', message = 'نأسف لحدوث خطأ أثناء تحميل البيانات', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}
