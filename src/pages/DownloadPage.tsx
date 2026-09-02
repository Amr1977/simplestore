import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ExternalLink, Smartphone, Shield, ArrowRight, AlertCircle } from 'lucide-react'
import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import { LoadingState } from '@/components/ui'
import { useStore } from '@/features/store/StoreContext'
import { APP_VERSION } from '@/generated/version'
import { APK_RELEASES_URL, APK_LATEST_URL, STORE_NAME } from '@/lib/links'

interface ReleaseInfo {
  version: string
  url: string
  publishedAt?: string
  size?: number
}

async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  if (typeof fetch !== 'function') return null
  try {
    const url = APK_RELEASES_URL.replace(/\/$/, '')
    const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/releases/)
    if (!repoMatch) return null
    const apiUrl = `https://api.github.com/repos/${repoMatch[1]}/${repoMatch[2]}/releases/latest`
    const res = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) return null
    const data = await res.json()
    const apk = (data.assets as Array<{ name: string; browser_download_url: string; size: number }> | undefined)
      ?.find(a => a.name.toLowerCase().endsWith('.apk'))
    return {
      version: (data.tag_name as string | undefined) ?? APP_VERSION,
      url: apk?.browser_download_url ?? data.html_url ?? url,
      publishedAt: data.published_at as string | undefined,
      size: apk?.size,
    }
  } catch {
    return null
  }
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return ''
  const mb = bytes / (1024 * 1024)
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`
  return `${mb.toFixed(1)} MB`
}

export default function DownloadPage() {
  const { store, loading } = useStore()
  const [release, setRelease] = useState<ReleaseInfo | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setChecking(true)
    fetchLatestRelease()
      .then(info => {
        if (cancelled) return
        setRelease(info)
        setError(info ? null : 'تعذر الوصول إلى GitHub Releases — سيتم فتح صفحة الإصدارات بدلاً من ذلك.')
      })
      .catch(() => {
        if (cancelled) return
        setError('تعذر الوصول إلى GitHub Releases — سيتم فتح صفحة الإصدارات بدلاً من ذلك.')
      })
      .finally(() => {
        if (cancelled) return
        setChecking(false)
      })
    return () => { cancelled = true }
  }, [])

  const directDownloadUrl = APK_LATEST_URL || release?.url || APK_RELEASES_URL
  const isDirectAsset = directDownloadUrl.toLowerCase().endsWith('.apk')
  const versionLabel = release?.version ?? APP_VERSION
  const sizeLabel = formatBytes(release?.size)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
          <LoadingState count={3} />
        </main>
        <Footer />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">المتجر غير متاح حالياً</h2>
            <p className="text-sm text-muted mb-6">نعتذر عن الإزعاج، يرجى المحاولة لاحقاً</p>
            <Link to="/" className="text-primary font-medium hover:underline">العودة للرئيسية</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition mb-4"
          >
            <ArrowRight size={18} />
            <span>رجوع للمتجر</span>
          </Link>
        </div>

        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Smartphone size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-ink mb-1">تحميل تطبيق {STORE_NAME}</h1>
                <p className="text-sm text-muted">
                  ثبّت التطبيق على جهاز الأندرويد للتصفّح السريع والطلب بدون فتح المتصفح.
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-surface border border-border rounded-lg p-3">
                <dt className="text-xs text-muted mb-0.5">الإصدار</dt>
                <dd className="font-mono font-semibold text-ink tabular-nums" dir="ltr">v{versionLabel}</dd>
              </div>
              <div className="bg-surface border border-border rounded-lg p-3">
                <dt className="text-xs text-muted mb-0.5">الحجم</dt>
                <dd className="font-semibold text-ink">
                  {sizeLabel || (checking ? '...' : '—')}
                </dd>
              </div>
            </dl>

            <a
              href={directDownloadUrl}
              target={isDirectAsset ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary text-surface-elevated px-6 py-3.5 rounded-full text-base font-semibold hover:bg-primary-soft transition shadow-sm"
            >
              <Download size={20} />
              <span>تحميل APK</span>
              <ExternalLink size={16} className="opacity-70" />
            </a>

            <a
              href={APK_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 text-sm text-muted hover:text-primary transition"
            >
              <span>عرض كل الإصدارات على GitHub</span>
              <ExternalLink size={14} />
            </a>

            {error && (
              <p className="mt-4 text-xs text-muted text-center" role="status">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
              <Shield size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-ink mb-1">تثبيت آمن</h2>
                <p className="text-xs text-muted leading-relaxed">
                  التطبيق مفتوح المصدر. قد يطلب أندرويد تفعيل «تثبيت من مصادر غير معروفة» للمرة الأولى فقط.
                </p>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
              <Download size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-ink mb-1">تحديثات تلقائية</h2>
                <p className="text-xs text-muted leading-relaxed">
                  الإصدار {versionLabel} هو الأحدث. ستظهر إشعارات التحديث داخل التطبيق عند توفر نسخة جديدة.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
