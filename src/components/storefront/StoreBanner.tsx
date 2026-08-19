import type { Store } from '@/types'

interface StoreBannerProps {
  store: Store
}

export default function StoreBanner({ store }: StoreBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-sm mx-4 mt-4">
      <div
        className="w-full h-48 sm:h-64 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${store.banner})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{store.name}</h2>
        {store.description && (
          <p className="text-sm sm:text-base text-white/80 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  )
}
