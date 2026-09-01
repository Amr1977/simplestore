import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

const getStoreBySlugMock = vi.fn()

vi.mock('@/firebase/firestore', () => ({
  getStoreBySlug: (...args: unknown[]) => getStoreBySlugMock(...args),
}))

import { StoreProvider, useStore } from '@/features/store'
import type { Store } from '@/types'

const sampleStore: Store = {
  id: 'abu-qir-demo',
  slug: 'abu-qir-grocery',
  name: 'بقالة أبو قير',
  whatsappNumber: '201234567890',
  phone: '03-1234567',
  address: 'أبو قير - الإسكندرية',
  theme: { primary: '#000000', secondary: '#000000', accent: '#000000' },
  delivery: { enabled: true, fee: 0, minimumOrder: 0, freeDeliveryThreshold: 0 },
  openingHours: {
    sunday: { open: '08:00', close: '22:00' },
    monday: { open: '08:00', close: '22:00' },
    tuesday: { open: '08:00', close: '22:00' },
    wednesday: { open: '08:00', close: '22:00' },
    thursday: { open: '08:00', close: '22:00' },
    friday: { open: '08:00', close: '22:00' },
    saturday: { open: '08:00', close: '22:00' },
  },
  active: true,
}

function Consumer() {
  const { storeId, loading } = useStore()
  if (loading) return <div>loading</div>
  return <div data-testid="store-id">{storeId}</div>
}

describe('StoreProvider', () => {
  beforeEach(() => {
    getStoreBySlugMock.mockReset()
  })

  it('queries Firestore with the slug provided via the env var, not the URL', async () => {
    getStoreBySlugMock.mockResolvedValue(sampleStore)
    const envSlug = 'abu-qir-grocery'

    window.history.pushState({}, '', '/cart')
    try {
      render(
        <StoreProvider slug={envSlug}>
          <Consumer />
        </StoreProvider>,
      )
      await waitFor(() => {
        expect(getStoreBySlugMock).toHaveBeenCalledWith('abu-qir-grocery')
      })
      expect(await screen.findByTestId('store-id')).toHaveTextContent('abu-qir-demo')
    } finally {
      window.history.pushState({}, '', '/')
    }
  })

  it("does not derive the slug from window.location.pathname", async () => {
    getStoreBySlugMock.mockResolvedValue(sampleStore)
    window.history.pushState({}, '', '/product/123')
    try {
      render(
        <StoreProvider slug="abu-qir-grocery">
          <Consumer />
        </StoreProvider>,
      )
      await waitFor(() => {
        expect(getStoreBySlugMock).toHaveBeenCalledWith('abu-qir-grocery')
      })
    } finally {
      window.history.pushState({}, '', '/')
    }
  })
})