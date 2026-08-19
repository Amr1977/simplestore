import { type SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, value, onChange, options, placeholder, className = '', id, name, ...props }, ref) => {
    const selectId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div dir="rtl" className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            dir="rtl"
            className={`
              w-full px-4 py-2.5 rounded-lg border border-border
              bg-surface text-text
              appearance-none
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
              transition-colors duration-200
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
