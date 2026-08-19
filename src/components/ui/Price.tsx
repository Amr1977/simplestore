interface PriceProps {
  amount: number
  oldPrice?: number
  unit?: string
}

export function Price({ amount, oldPrice, unit }: PriceProps) {
  const formattedAmount = new Intl.NumberFormat('ar-EG').format(amount)

  return (
    <div dir="rtl" className="flex flex-wrap items-baseline gap-2">
      <span className="text-lg font-bold text-primary">
        {formattedAmount} <span className="text-sm font-medium">جنيه</span>
      </span>
      {oldPrice && oldPrice > amount && (
        <span className="text-sm text-muted line-through">
          {new Intl.NumberFormat('ar-EG').format(oldPrice)} جنيه
        </span>
      )}
      {unit && (
        <span className="text-xs text-muted">/ {unit}</span>
      )}
    </div>
  )
}
