import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      dir="rtl"
      className={`
        bg-surface rounded-xl shadow-sm border border-border
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
