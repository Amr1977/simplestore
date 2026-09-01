import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { store } from '../src/data/store'
import { categories } from '../src/data/categories'
import { products } from '../src/data/products'

function toFirestoreData(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
    const value = obj[key]
    if (value instanceof Date) {
      result[key] = value
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        item instanceof Date
          ? item
          : typeof item === 'object' && item !== null
            ? toFirestoreData(item as Record<string, unknown>)
            : item,
      )
    } else if (value !== null && typeof value === 'object') {
      result[key] = toFirestoreData(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result
}

export const E2E_STORE_ID = 'abu-qir-demo'
export const E2E_SLUG = 'abu-qir-grocery'
export const E2E_ADMIN_EMAIL = 'admin@test.local'
export const E2E_ADMIN_PASSWORD = 'TestAdmin123!'

function getAdminApp() {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
  process.env.GCLOUD_PROJECT = 'simplestore77'
  process.env.GOOGLE_CLOUD_PROJECT = 'simplestore77'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'

  const existing = getApps().find(a => a.name === 'e2e-seed')
  if (existing) return existing
  return initializeApp({ projectId: 'simplestore77' }, 'e2e-seed')
}

function getDb() {
  return getFirestore(getAdminApp())
}

export async function seedEmulator(): Promise<void> {
  const db = getDb()

  const storeData = toFirestoreData(store as unknown as Record<string, unknown>)
  delete storeData.id
  await db.doc(`stores/${E2E_STORE_ID}`).set(storeData)

  const storeCategories = categories.filter(c => c.storeId === E2E_STORE_ID)
  for (const category of storeCategories) {
    const catData = toFirestoreData(category as unknown as Record<string, unknown>)
    delete catData.id
    delete catData.storeId
    await db.doc(`stores/${E2E_STORE_ID}/categories/${category.id}`).set(catData)
  }

  const storeProducts = products.filter(p => p.storeId === E2E_STORE_ID)
  for (const product of storeProducts) {
    const prodData = toFirestoreData(product as unknown as Record<string, unknown>)
    delete prodData.id
    delete prodData.storeId
    await db.doc(`stores/${E2E_STORE_ID}/products/${product.id}`).set(prodData)
  }
}

export async function clearEmulator(): Promise<void> {
  const db = getDb()

  const stores = await db.collection('stores').get()
  for (const doc of stores.docs) {
    const [categoriesSnap, productsSnap] = await Promise.all([
      db.collection(`stores/${doc.id}/categories`).get(),
      db.collection(`stores/${doc.id}/products`).get(),
    ])
    for (const c of categoriesSnap.docs) await c.ref.delete()
    for (const p of productsSnap.docs) await p.ref.delete()
    await doc.ref.delete()
  }
}
