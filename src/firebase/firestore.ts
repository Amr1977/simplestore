import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'

export async function getStore(storeId: string) {
  const ref = doc(db, 'stores', storeId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as any
}

export async function getStoreBySlug(slug: string) {
  const q = query(collection(db, 'stores'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as any
}

export async function getCategories(storeId: string) {
  const q = query(
    collection(db, 'stores', storeId, 'categories'),
    where('active', '==', true),
    orderBy('sortOrder', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
}

export async function getProducts(storeId: string, categoryId?: string) {
  const constraints: QueryConstraint[] = [
    where('available', '==', true),
    orderBy('sortOrder', 'asc'),
  ]
  if (categoryId) {
    constraints.push(where('categoryId', '==', categoryId))
  }
  const q = query(collection(db, 'stores', storeId, 'products'), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
}

export async function getFeaturedProducts(storeId: string) {
  const q = query(
    collection(db, 'stores', storeId, 'products'),
    where('featured', '==', true),
    where('available', '==', true),
    orderBy('sortOrder', 'asc'),
    limit(8)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
}

export async function getPopularProducts(storeId: string) {
  const q = query(
    collection(db, 'stores', storeId, 'products'),
    where('popular', '==', true),
    where('available', '==', true),
    orderBy('sortOrder', 'asc'),
    limit(8)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
}

export async function getProduct(storeId: string, productId: string) {
  const ref = doc(db, 'stores', storeId, 'products', productId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as any
}

export async function getOrder(storeId: string, orderId: string) {
  const ref = doc(db, 'stores', storeId, 'orders', orderId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as any
}

export async function searchProducts(storeId: string, term: string) {
  const q = query(
    collection(db, 'stores', storeId, 'products'),
    where('available', '==', true),
    orderBy('sortOrder', 'asc')
  )
  const snap = await getDocs(q)
  const normalized = term.trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase()
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter((p: any) => {
      const name = p.name.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase()
      return name.includes(normalized)
    }) as any[]
}

export async function createOrder(storeId: string, order: any) {
  const ref = await addDoc(collection(db, 'stores', storeId, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getOrders(storeId: string) {
  const q = query(
    collection(db, 'stores', storeId, 'orders'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
}

export async function updateOrderStatus(storeId: string, orderId: string, status: string) {
  const ref = doc(db, 'stores', storeId, 'orders', orderId)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

export async function updateStore(storeId: string, data: Partial<any>) {
  const ref = doc(db, 'stores', storeId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function createProduct(storeId: string, data: any) {
  const ref = await addDoc(collection(db, 'stores', storeId, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(storeId: string, productId: string, data: Partial<any>) {
  const ref = doc(db, 'stores', storeId, 'products', productId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(storeId: string, productId: string) {
  const ref = doc(db, 'stores', storeId, 'products', productId)
  await deleteDoc(ref)
}

export async function createCategory(storeId: string, data: any) {
  const ref = await addDoc(collection(db, 'stores', storeId, 'categories'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCategory(storeId: string, categoryId: string, data: Partial<any>) {
  const ref = doc(db, 'stores', storeId, 'categories', categoryId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteCategory(storeId: string, categoryId: string) {
  const ref = doc(db, 'stores', storeId, 'categories', categoryId)
  await deleteDoc(ref)
}

export function subscribeToOrders(storeId: string, callback: (orders: any[]) => void) {
  const q = query(
    collection(db, 'stores', storeId, 'orders'),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}
