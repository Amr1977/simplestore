import { describe, it, expect, vi } from 'vitest'
import { formatPrice, validateEgyptianPhone, formatPhoneForWhatsApp, isStoreOpen } from '@/lib/helpers'

describe('formatPrice', () => {
  it('formats correctly', () => {
    expect(formatPrice(100)).toBe('100 جنيه')
    expect(formatPrice(99)).toBe('99 جنيه')
    expect(formatPrice(0)).toBe('0 جنيه')
    expect(formatPrice(1500)).toBe('1500 جنيه')
  })
})

describe('validateEgyptianPhone', () => {
  it('validates correctly', () => {
    expect(validateEgyptianPhone('01012345678')).toBe(true)
    expect(validateEgyptianPhone('01112345678')).toBe(true)
    expect(validateEgyptianPhone('01212345678')).toBe(true)
    expect(validateEgyptianPhone('201012345678')).toBe(true)
    expect(validateEgyptianPhone('12345')).toBe(false)
    expect(validateEgyptianPhone('0101234567')).toBe(false)
    expect(validateEgyptianPhone('010123456789')).toBe(false)
  })
})

describe('formatPhoneForWhatsApp', () => {
  it('formats correctly', () => {
    expect(formatPhoneForWhatsApp('01012345678')).toBe('201012345678')
    expect(formatPhoneForWhatsApp('201012345678')).toBe('201012345678')
    expect(formatPhoneForWhatsApp('+201012345678')).toBe('201012345678')
  })
})

describe('isStoreOpen', () => {
  it('returns true during opening hours', () => {
    vi.useFakeTimers()
    const openingHours = {
      monday: { open: '08:00', close: '23:00' },
      tuesday: { open: '08:00', close: '23:00' },
      wednesday: { open: '08:00', close: '23:00' },
      thursday: { open: '08:00', close: '23:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '23:00' },
    }
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z'))
    expect(isStoreOpen(openingHours)).toBe(true)
    vi.useRealTimers()
  })

  it('returns false before opening hours', () => {
    vi.useFakeTimers()
    const openingHours = {
      monday: { open: '08:00', close: '23:00' },
      tuesday: { open: '08:00', close: '23:00' },
      wednesday: { open: '08:00', close: '23:00' },
      thursday: { open: '08:00', close: '23:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '23:00' },
    }
    vi.setSystemTime(new Date('2024-01-01T05:00:00Z'))
    expect(isStoreOpen(openingHours)).toBe(false)
    vi.useRealTimers()
  })

  it('returns false after closing hours', () => {
    vi.useFakeTimers()
    const openingHours = {
      monday: { open: '08:00', close: '23:00' },
      tuesday: { open: '08:00', close: '23:00' },
      wednesday: { open: '08:00', close: '23:00' },
      thursday: { open: '08:00', close: '23:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '23:00' },
    }
    vi.setSystemTime(new Date('2024-01-01T23:30:00Z'))
    expect(isStoreOpen(openingHours)).toBe(false)
    vi.useRealTimers()
  })

  it('returns false on closed days', () => {
    vi.useFakeTimers()
    const openingHours = {
      friday: { open: '08:00', close: '23:00', closed: true },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '23:00' },
      monday: { open: '08:00', close: '23:00' },
      tuesday: { open: '08:00', close: '23:00' },
      wednesday: { open: '08:00', close: '23:00' },
      thursday: { open: '08:00', close: '23:00' },
    }
    vi.setSystemTime(new Date('2024-01-05T10:00:00Z'))
    expect(isStoreOpen(openingHours)).toBe(false)
    vi.useRealTimers()
  })
})
