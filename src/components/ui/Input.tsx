import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  name?: string
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, placeholder, value, onChange, type = 'text', name, required, className = '', id, ...props }, ref) => {
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full" dir="rtl">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text mb-1"
          >
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          dir="rtl"
          className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-surface text-text
            placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-colors duration-200
            ${error ? 'border-red-500' : 'border-border'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
