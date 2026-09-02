import { Minus, Plus } from 'lucide-react'

interface QuantityControlProps {
  quantity: number
  onUpdate: (quantity: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export function QuantityControl({ quantity, onUpdate, min = 1, max = 99, size = 'md' }: QuantityControlProps) {
  const btnClass = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-8 h-8 text-base'

  return (
    <div className="flex items-center gap-1" dir="ltr">
      <button
        type="button"
        onClick={() => onUpdate(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={`${btnClass} rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition`}
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={() => onUpdate(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${btnClass} rounded-full border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition`}
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  )
}

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function QuantityStepper({ value, onChange, className = '' }: QuantityStepperProps) {
  return (
    <div className={`inline-flex items-center gap-1 border border-gray-200 rounded-full overflow-hidden bg-surface-elevated ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
