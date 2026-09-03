import { describe, it, expect } from 'vitest'
import { generateStoreLogo } from '@/lib/storeLogo'

describe('generateStoreLogo', () => {
  it('returns a data URL for an SVG', () => {
    const url = generateStoreLogo({ name: 'بقالة أبو قير' })
    expect(url.startsWith('data:image/svg+xml;utf8,')).toBe(true)
    expect(decodeURIComponent(url)).toContain('<svg')
  })

  it('embeds the store name in the SVG', () => {
    const url = generateStoreLogo({ name: 'متجر الاختبار' })
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('متجر الاختبار')
    expect(decoded).toContain('aria-label="متجر الاختبار"')
  })

  it('uses the first character as the monogram', () => {
    const url = generateStoreLogo({ name: 'العطار' })
    const decoded = decodeURIComponent(url)
    expect(decoded).toMatch(/<text[^>]*>ا<\/text>/)
  })

  it('produces different palettes for different names (hash-based)', () => {
    const a = decodeURIComponent(generateStoreLogo({ name: 'أ' }))
    const b = decodeURIComponent(generateStoreLogo({ name: 'بقالة أبو قير' }))
    expect(a).not.toBe(b)
  })

  it('respects the shape option for banner vs square', () => {
    const square = decodeURIComponent(generateStoreLogo({ name: 'X', shape: 'square' }))
    const banner = decodeURIComponent(generateStoreLogo({ name: 'X', shape: 'banner' }))
    expect(square).toContain('viewBox="0 0 400 400"')
    expect(banner).toContain('viewBox="0 0 800 240"')
  })

  it('handles an empty name with a placeholder monogram', () => {
    const url = generateStoreLogo({ name: '' })
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('>?</text>')
  })

  it('escapes special characters in the name', () => {
    const url = generateStoreLogo({ name: 'A & B' })
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('A &amp; B')
  })
})
