import { describe, it, expect } from 'vitest'
import { normalizeArabic, searchMatches } from '@/lib/helpers'

describe('normalizeArabic', () => {
  it('converts أإآ to ا', () => {
    expect(normalizeArabic('أ')).toBe('ا')
    expect(normalizeArabic('إ')).toBe('ا')
    expect(normalizeArabic('آ')).toBe('ا')
    expect(normalizeArabic('أحمد')).toBe('احمد')
    expect(normalizeArabic('إسلام')).toBe('اسلام')
    expect(normalizeArabic('آسيا')).toBe('اسيا')
  })

  it('converts ة to ه', () => {
    expect(normalizeArabic('ة')).toBe('ه')
    expect(normalizeArabic('مدرسة')).toBe('مدرسه')
    expect(normalizeArabic('كتيبة')).toBe('كتيبه')
  })

  it('converts ى to ي', () => {
    expect(normalizeArabic('ى')).toBe('ي')
    expect(normalizeArabic('على')).toBe('علي')
    expect(normalizeArabic('مصرى')).toBe('مصري')
  })

  it('trims and lowercases', () => {
    expect(normalizeArabic('  طماطم  ')).toBe('طماطم')
  })
})

describe('searchMatches', () => {
  it('matches exact', () => {
    expect(searchMatches('طماطم', 'طماطم')).toBe(true)
  })

  it('matches partial', () => {
    expect(searchMatches('طماطم طازجة', 'طماطم')).toBe(true)
  })

  it('returns false for no match', () => {
    expect(searchMatches('طماطم', 'بطاطس')).toBe(false)
  })

  it('matches with Arabic variant normalization', () => {
    expect(searchMatches('أحمد', 'احمد')).toBe(true)
    expect(searchMatches('مدرسة', 'مدرسه')).toBe(true)
    expect(searchMatches('على', 'علي')).toBe(true)
  })
})
