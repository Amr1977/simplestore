import { describe, it, expect } from 'vitest'
import { store } from '@/data/store'

describe('Store data', () => {
  it('has required fields', () => {
    expect(store.id).toBe('abu-qir-demo')
    expect(store.name).toBe('بقالة أبو قير')
    expect(store.slug).toBe('abu-qir-grocery')
    expect(store.whatsappNumber).toBe('201234567890')
    expect(store.phone).toBe('03-1234567')
    expect(store.address).toBe('أبو قير - الإسكندرية')
  })

  it('has valid theme colors', () => {
    expect(store.theme.primary).toMatch(/^#[0-9a-f]{6}$/i)
    expect(store.theme.secondary).toMatch(/^#[0-9a-f]{6}$/i)
    expect(store.theme.accent).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('has delivery configuration', () => {
    expect(store.delivery.enabled).toBe(true)
    expect(store.delivery.fee).toBeGreaterThanOrEqual(0)
    expect(store.delivery.minimumOrder).toBeGreaterThanOrEqual(0)
    expect(store.delivery.freeDeliveryThreshold).toBeGreaterThan(store.delivery.minimumOrder)
  })

  it('has opening hours for all days', () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    for (const day of days) {
      expect(store.openingHours[day]).toBeDefined()
      expect(store.openingHours[day].open).toBeDefined()
      expect(store.openingHours[day].close).toBeDefined()
    }
  })

  it('is active', () => {
    expect(store.active).toBe(true)
  })
})
