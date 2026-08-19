interface QuantityControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityControl({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityControlProps) {
  const handleDecrement = () => {
    const next = value - 1
    if (next >= min) onChange(next)
  }

  const handleIncrement = () => {
    const next = value + 1
    if (next <= max) onChange(next)
  }

  return (
    <div
      className="inline-flex items-center gap-1 bg-surface border border-border rounded-xl overflow-hidden"
      dir="rtl"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="
          w-11 h-11 flex items-center justify-center
          text-xl font-medium text-muted
          hover:bg-gray-50 hover:text-text
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150
          select-none
        "
        aria-label="تقليل الكمية"
      >
        −
      </button>
      <span
        className="
          w-12 h-11 flex items-center justify-center
          text-base font-semibold text-text
          select-none
          border-x border-border
        "
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="
          w-11 h-11 flex items-center justify-center
          text-xl font-medium text-muted
          hover:bg-gray-50 hover:text-text
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150
          select-none
        "
        aria-label="زيادة الكمية"
      >
        +
      </button>
    </div>
  )
}
