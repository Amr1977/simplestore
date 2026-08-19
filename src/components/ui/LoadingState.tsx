import { type ReactNode } from 'react'

type LoadingVariant = 'card' | 'text' | 'circle'

interface LoadingStateProps {
  variant?: LoadingVariant
  count?: number
  className?: string
}

function shimmer() {
  return `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `
}

const shimmerClass = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]'

function CircleSkeleton() {
  return (
    <div className={`rounded-full ${shimmerClass}`} style={{ width: 48, height: 48 }} />
  )
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <div className={`h-4 rounded ${shimmerClass}`} style={{ width: '80%' }} />
      <div className={`h-4 rounded ${shimmerClass}`} style={{ width: '60%' }} />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className={`rounded-xl border border-border p-4 space-y-4`}>
      <div className={`h-48 rounded-lg ${shimmerClass}`} />
      <div className="space-y-2">
        <div className={`h-5 rounded ${shimmerClass}`} style={{ width: '70%' }} />
        <div className={`h-4 rounded ${shimmerClass}`} style={{ width: '90%' }} />
      </div>
      <div className={`h-6 rounded ${shimmerClass}`} style={{ width: '40%' }} />
    </div>
  )
}

export function LoadingState({ variant = 'text', count = 1, className = '' }: LoadingStateProps) {
  const renderSkeleton = (): ReactNode => {
    switch (variant) {
      case 'card':
        return <CardSkeleton />
      case 'circle':
        return <CircleSkeleton />
      case 'text':
      default:
        return <TextSkeleton />
    }
  }

  return (
    <div dir="rtl" className={className}>
      <style>{shimmer()}</style>
      <div className={`space-y-4 ${shimmerClass}`} style={{ animation: 'shimmer 1.5s infinite' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    </div>
  )
}
