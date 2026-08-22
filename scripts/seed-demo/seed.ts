#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { store } from '../../src/data/store'
import { categories } from '../../src/data/categories'
import { products } from '../../src/data/products'

const BATCH_LIMIT = 500

function parseArgs() {
  const args = process.argv.slice(2)
  let storeId = 'abu-qir-demo'

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--store-id' && args[i + 1]) {
      storeId = args[i + 1]
      i++
    }
  }

  return { storeId }
}

function toFirestoreData(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
    const value = obj[key]
    if (value instanceof Date) {
      result[key] = value
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => (item instanceof Date ? item : typeof item === 'object' && item !== null ? toFirestoreData(item as Record<string, unknown>) : item))
    } else if (value !== null && typeof value === 'object') {
      result[key] = toFirestoreData(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result
}

async function main() {
  const { storeId } = parseArgs()

  console.log('\n🌱 Starting seed process... | بدء عملية كتابة البيانات...\n')

  let adminKeyJson: string | undefined
  try {
    adminKeyJson = process.env.FIREBASE_ADMIN_KEY
    if (!adminKeyJson) {
      console.error('❌ خطأ: متغير البيئة FIREBASE_ADMIN_KEY غير موجود')
      console.error('❌ Error: FIREBASE_ADMIN_KEY environment variable is missing\n')
      console.error('Set it to the JSON content of your Firebase service account key.')
      console.error('قم بتعيينه إلى محتوى مفتاح حساب خدمة Firebase بتنسيق JSON.')
      process.exit(1)
    }
  } catch (e) {
    console.error('❌ خطأ في قراءة متغير البيئة / Error reading environment variable:', e)
    process.exit(1)
  }

  let serviceAccount: Record<string, unknown>
  try {
    serviceAccount = JSON.parse(adminKeyJson)
  } catch (e) {
    console.error('❌ خطأ في تحليل بيانات حساب الخدمة / Error parsing service account JSON:', e)
    process.exit(1)
  }

  try {
    initializeApp({
      credential: cert(serviceAccount as any),
    })
  } catch (e) {
    console.error('❌ خطأ في تهيئة Firebase Admin / Error initializing Firebase Admin:', e)
    process.exit(1)
  }

  const db = getFirestore()

  const operations: { path: string; data: Record<string, unknown> }[] = []

  const storeData = toFirestoreData(store as unknown as Record<string, unknown>)
  delete storeData.id
  operations.push({ path: `stores/${storeId}`, data: storeData })

  const storeCategories = categories.filter(c => c.storeId === storeId)
  for (const category of storeCategories) {
    const catData = toFirestoreData(category as unknown as Record<string, unknown>)
    delete catData.id
    delete catData.storeId
    operations.push({ path: `stores/${storeId}/categories/${category.id}`, data: catData })
  }

  const storeProducts = products.filter(p => p.storeId === storeId)
  for (const product of storeProducts) {
    const prodData = toFirestoreData(product as unknown as Record<string, unknown>)
    delete prodData.id
    delete prodData.storeId
    operations.push({ path: `stores/${storeId}/products/${product.id}`, data: prodData })
  }

  console.log(`📊 إجمالي العمليات / Total operations: ${operations.length}\n`)

  const batches: ReturnType<typeof db.batch>[] = []
  let currentBatch = db.batch()
  let batchCount = 0

  for (let i = 0; i < operations.length; i++) {
    const { path, data } = operations[i]
    const ref = db.doc(path)
    currentBatch.set(ref, data)
    batchCount++

    if (batchCount === BATCH_LIMIT) {
      batches.push(currentBatch)
      currentBatch = db.batch()
      batchCount = 0
    }
  }

  if (batchCount > 0) {
    batches.push(currentBatch)
  }

  for (let i = 0; i < batches.length; i++) {
    const progress = `[${i + 1}/${batches.length}]`
    try {
      await batches[i].commit()
      console.log(`${progress} ✅ تم كتابة الدفعة بنجاح / Batch committed successfully`)
    } catch (e) {
      console.error(`${progress} ❌ خطأ في كتابة الدفعة / Batch commit error:`, e)
      process.exit(1)
    }
  }

  console.log(`\n🎉 تم الانتهاء بنجاح! / Seeding completed successfully!`)
  console.log(`   - المتجر / Store: ${storeId}`)
  console.log(`   - الأقسام / Categories: ${storeCategories.length}`)
  console.log(`   - المنتجات / Products: ${storeProducts.length}\n`)
}

main().catch(e => {
  console.error('❌ خطأ غير متوقع / Unexpected error:', e)
  process.exit(1)
})
