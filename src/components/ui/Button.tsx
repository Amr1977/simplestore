import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-secondary',
  secondary: 'bg-secondary text-white hover:bg-primary',
  outline: 'border border-border bg-transparent text-text hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-surface',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      dir="rtl"
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {!loading && children}
    </button>
  )
}
