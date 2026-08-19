import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'ابحث...',
  onFocus,
  onBlur,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={`
        relative flex items-center
        bg-surface border rounded-xl
        transition-all duration-200
        ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
      `}
      dir="rtl"
    >
      <Search className="absolute right-3 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true)
          onFocus?.()
        }}
        onBlur={() => {
          setIsFocused(false)
          onBlur?.()
        }}
        dir="rtl"
        className="
          w-full py-2.5 pr-10 pl-10
          bg-transparent text-text
          placeholder:text-muted
          focus:outline-none
          text-base
        "
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute left-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      )}
    </div>
  )
}
