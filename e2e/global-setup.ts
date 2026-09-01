import { seedEmulator, clearEmulator } from './seed'

export default async function globalSetup() {
  console.log('[e2e] waiting for firestore emulator on 127.0.0.1:8080...')
  await waitForPort('127.0.0.1', 8080, 30_000)
  console.log('[e2e] waiting for auth emulator on 127.0.0.1:9099...')
  await waitForPort('127.0.0.1', 9099, 30_000)

  console.log('[e2e] clearing emulator...')
  await clearEmulator()
  console.log('[e2e] seeding emulator...')
  await seedEmulator()
  console.log('[e2e] verifying seed...')
  await verifySeed()
  console.log('[e2e] creating admin user...')
  await createAdminUser()
  console.log('[e2e] global setup complete')
}

async function waitForPort(host: string, port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://${host}:${port}/`)
      if (res.status < 500) return
    } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`${host}:${port} did not become ready within ${timeoutMs}ms`)
}

async function verifySeed(): Promise<void> {
  const deadline = Date.now() + 10_000
  let lastError: unknown
  while (Date.now() < deadline) {
    try {
      const res = await fetch('http://127.0.0.1:8080/v1/projects/simplestore77/databases/(default)/documents/stores/abu-qir-demo')
      if (res.ok) {
        const body = (await res.json()) as { fields?: { slug?: { stringValue?: string } } }
        if (body.fields?.slug?.stringValue === 'abu-qir-grocery') {
          console.log('[e2e] seed verified: stores/abu-qir-demo slug=abu-qir-grocery')
          return
        }
        lastError = new Error(`wrong slug: ${JSON.stringify(body.fields?.slug)}`)
      } else {
        lastError = new Error(`status ${res.status}`)
      }
    } catch (e) {
      lastError = e
    }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`seed verification failed: ${String(lastError)}`)
}

async function createAdminUser(): Promise<void> {
  const email = 'admin@test.local'
  const password = 'TestAdmin123!'
  const apiKey = 'fake-api-key'

  const res = await fetch(
    `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  )
  if (!res.ok) {
    const text = await res.text()
    if (!text.includes('EMAIL_EXISTS')) {
      throw new Error(`Auth emulator signup failed: ${res.status} ${text}`)
    }
  }
  console.log('[e2e] admin user created (or already exists)')
}
