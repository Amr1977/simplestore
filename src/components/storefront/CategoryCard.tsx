import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center gap-2.5 min-w-[76px] group"
    >
      <div className="relative w-[68px] h-[68px] sm:w-20 sm:h-20 overflow-hidden bg-[#f0e8d6] transition-all duration-300 group-hover:bg-accent/20">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary">
            <span className="font-display text-2xl font-bold">{category.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-border-strong/0 group-hover:ring-primary transition-all duration-300" />
      </div>
      <span className="text-[13px] sm:text-sm font-medium text-ink-soft text-center truncate w-full group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </Link>
  )
}
