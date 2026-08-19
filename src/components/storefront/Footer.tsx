import { useStore } from '@/features/store/StoreContext'
import { isStoreOpen } from '@/lib/helpers'
import { Phone, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  const { store } = useStore()
  const s = store!
  const open = isStoreOpen(s.openingHours)

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin size={18} className="shrink-0 mt-0.5 text-gray-400" />
            <span>{s.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={18} className="shrink-0 text-gray-400" />
            <a href={`tel:${s.phone}`} className="hover:text-primary transition">
              {s.phone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} className="shrink-0 text-gray-400" />
            <span className={open ? 'text-green-600' : 'text-red-500'}>
              {open ? 'المتجر مفتوح الآن' : 'المتجر مغلق حالياً'}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-200 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} {s.name}
          </div>
        </div>
      </div>
    </footer>
  )
}
