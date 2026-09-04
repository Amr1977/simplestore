import type { Page } from '@playwright/test'

export interface AdminSession {
  uid: string
  email: string
}

/**
 * Signs in as a Google test user for the Firebase Auth Emulator.
 *
 * Flow (per Firebase docs):
 *   "Rewire or comment out the part of your code that retrieve idTokens from
 *    the IDP. Use a literal JSON string in place of the token for
 *    signInWithCredential. ... When used with the emulator, this code will
 *    successfully authenticate a user."
 *
 * The app exposes __signInWithGoogleCredential__ which wraps
 * signInWithCredential(auth, GoogleAuthProvider.credential(<json>)).
 *
 * The user must already have a userProfile doc (written by global-setup.ts).
 */
export async function signInAsTestAdmin(
  page: Page,
  opts?: { email?: string; sub?: string }
): Promise<AdminSession> {
  const email = opts?.email ?? 'admin@test.local'
  const sub = opts?.sub ?? `e2e-admin-${Date.now()}`

  await page.goto('/admin/login')
  await page.waitForFunction(
    () => typeof (window as any).__signInWithGoogleCredential__ === 'function',
    { timeout: 15_000 }
  )
  await page.evaluate(
    async ({ sub, email }) => {
      const w = window as any
      const fakeJwt = JSON.stringify({
        sub,
        email,
        email_verified: true,
        name: 'E2E Admin',
        iss: 'https://accounts.google.com',
        aud: 'fake-aud',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
      await w.__signInWithGoogleCredential__(fakeJwt)
    },
    { sub, email }
  )

  await page.waitForURL(/\/admin(\/(?!login).*|$)/, { timeout: 15_000 })

  return { uid: sub, email }
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await signInAsTestAdmin(page)
}

