import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const adminKeyJson = process.env.FIREBASE_ADMIN_KEY
if (!adminKeyJson) {
  console.error('FIREBASE_ADMIN_KEY env var is required.')
  process.exit(1)
}

const serviceAccount = JSON.parse(adminKeyJson)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const storeId = 'abu-qir-demo'
const productId = 'prod-11'

const publicId = 'stores/abu-qir-demo/products/da6nzwkvchia5tc5egs1'
const version = '1788414229'
const secureUrl = `https://res.cloudinary.com/dththennt/image/upload/v${version}/${publicId}.png`
const thumbnailUrl = `https://res.cloudinary.com/dththennt/image/upload/f_auto,q_auto,w_400/${publicId}`

const newMedia = {
  id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  type: 'image',
  publicId,
  secureUrl,
  thumbnailUrl,
  width: 1024,
  height: 1024,
  sortOrder: 0,
}

const ref = db.doc(`stores/${storeId}/products/${productId}`)
const snap = await ref.get()
const existing = snap.data() || {}
const oldMedia = Array.isArray(existing.media) ? existing.media : []
// New image becomes primary: place it at sortOrder 0, shift the rest.
const shifted = oldMedia.map(m => ({ ...m, sortOrder: (m.sortOrder ?? 0) + 1 }))
const newMediaArr = [newMedia, ...shifted]

await ref.update({
  media: newMediaArr,
  updatedAt: new Date(),
})

console.log(`Updated ${storeId}/${productId}`)
console.log(`New primary: ${secureUrl}`)
console.log(`Total media: ${newMediaArr.length}`)
process.exit(0)
