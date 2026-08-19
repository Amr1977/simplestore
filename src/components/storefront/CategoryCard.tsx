import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center gap-2 min-w-[72px] group"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all shadow-sm bg-gray-100">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-2xl">{category.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700 text-center truncate w-full">
        {category.name}
      </span>
    </Link>
  )
}
