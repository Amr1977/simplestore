import { describe, it, expect, afterEach, vi } from 'vitest'

describe('getStoreSlug', () => {
  const originalEnv = import.meta.env.VITE_STORE_SLUG

  afterEach(() => {
    if (originalEnv === undefined) {
      delete import.meta.env.VITE_STORE_SLUG
    } else {
      import.meta.env.VITE_STORE_SLUG = originalEnv
    }
    vi.resetModules()
  })

  it('returns the env var when set', async () => {
    import.meta.env.VITE_STORE_SLUG = 'abu-qir-grocery'
    vi.resetModules()
    const { getStoreSlug } = await import('@/lib/store')
    expect(getStoreSlug()).toBe('abu-qir-grocery')
  })

  it("falls back to 'default' when the env var is missing", async () => {
    delete import.meta.env.VITE_STORE_SLUG
    vi.resetModules()
    const { getStoreSlug } = await import('@/lib/store')
    expect(getStoreSlug()).toBe('default')
  })

  it("does not read window.location.pathname", async () => {
    import.meta.env.VITE_STORE_SLUG = 'abu-qir-grocery'
    vi.resetModules()
    const { getStoreSlug } = await import('@/lib/store')
    const originalPathname = window.location.pathname
    try {
      window.history.pushState({}, '', '/cart')
      expect(getStoreSlug()).toBe('abu-qir-grocery')
    } finally {
      window.history.pushState({}, '', originalPathname || '/')
    }
  })
})