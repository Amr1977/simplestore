import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  globalSetup: './e2e/global-setup.ts',
  webServer: [
    {
      command: 'npx firebase emulators:start --only firestore,auth --project simplestore77',
      port: 8080,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: `npx tsc -b && npx vite build --outDir dist-e2e && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort --outDir dist-e2e`,
      port: PORT,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        VITE_USE_FIRESTORE_EMULATOR: 'true',
        VITE_STORE_SLUG: 'abu-qir-grocery',
        VITE_CLOUDINARY_CLOUD_NAME: 'test-cloud',
        VITE_CLOUDINARY_UPLOAD_PRESET: 'test-preset',
        VITE_WHATSAPP_NUMBER: '201234567890',
      },
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
})
