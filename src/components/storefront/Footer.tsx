import { useStore } from '@/features/store/StoreContext'
import { isStoreOpen } from '@/lib/helpers'
import { Phone, MapPin, Clock, ExternalLink, Download, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_VERSION } from '@/generated/version'
import { PORTFOLIO_URL } from '@/lib/links'

export default function Footer() {
  const { store, loading } = useStore()

  if (loading || !store) {
    return (
      <footer className="bg-surface border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 text-sm text-muted">
            <div className="h-4 bg-border rounded w-48 animate-pulse" />
            <div className="h-4 bg-border rounded w-32 animate-pulse" />
            <div className="h-4 bg-border rounded w-40 animate-pulse" />
            <div className="h-4 bg-border rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </footer>
    )
  }

  const open = isStoreOpen(store.openingHours)

  return (
    <footer className="bg-surface border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 text-sm text-ink-soft">
          <div className="flex items-start gap-2">
            <MapPin size={18} className="shrink-0 mt-0.5 text-muted" />
            <span>{store.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={18} className="shrink-0 text-muted" />
            <a href={`tel:${store.phone}`} className="hover:text-primary transition">
              {store.phone}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={18} className="shrink-0 text-muted" />
            <span className={open ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
              {open ? 'المتجر مفتوح الآن' : 'المتجر مغلق حالياً'}
            </span>
          </div>

          <div className="pt-4 mt-2 border-t border-border space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
              <Link
                to="/download"
                className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition"
              >
                <Download size={14} />
                <span>تحميل التطبيق</span>
              </Link>
              <span className="text-border" aria-hidden="true">•</span>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition"
              >
                <Globe size={14} />
                <span>المطور</span>
                <ExternalLink size={11} className="opacity-60" />
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-xs text-muted">
              <span>© {new Date().getFullYear()} {store.name}</span>
              <span className="hidden sm:inline text-border" aria-hidden="true">•</span>
              <span className="font-mono tabular-nums" dir="ltr">v{APP_VERSION}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
