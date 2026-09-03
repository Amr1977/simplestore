#!/usr/bin/env node
// Promote a user to super-admin by writing their userProfile.
// Usage: SUPER_ADMIN_UID=... node scripts/promote-super-admin.mjs

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

const uid = process.env.SUPER_ADMIN_UID
if (!uid) {
  console.error('SUPER_ADMIN_UID env var is required.')
  process.exit(1)
}

const email = 'amr.lotfy.authman@gmail.com'
const storeId = 'abu-qir-demo'

await db.doc(`userProfiles/${uid}`).set({
  email,
  role: 'super_admin',
  storeId,
  createdAt: new Date(),
})

console.log(`Promoted ${email} (uid=${uid}) as super_admin for store ${storeId}.`)
console.log('Sign in with Google using that email to access /admin.')
process.exit(0)
