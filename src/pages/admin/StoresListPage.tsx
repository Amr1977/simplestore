import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllStores } from '@/firebase/firestore'

export default function StoresListPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllStores()
      .then(setStores)
      .catch(err => console.error('Failed to load stores', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المتاجر</h1>
          <p className="text-sm text-gray-600 mt-1">جميع المتاجر المُسجّلة في النظام</p>
        </div>
        <Link
          to="/admin/signup"
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
        >
          + متجر جديد
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="w-16 h-16 rounded-lg bg-gray-200 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">لا توجد متاجر بعد.</p>
          <Link
            to="/admin/signup"
            className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            إنشاء أول متجر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map(store => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold shrink-0">
                    {store.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 truncate">{store.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5" dir="ltr">/{store.slug}</p>
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{store.description}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full ${store.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {store.active ? 'نشط' : 'متوقف'}
                </span>
                <span className="text-gray-500" dir="ltr">{store.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
