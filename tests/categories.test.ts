import { describe, it, expect } from 'vitest'
import { categories } from '@/data/categories'

describe('Categories data', () => {
  it('has exactly 10 categories', () => {
    expect(categories).toHaveLength(10)
  })

  it('all categories have required fields', () => {
    for (const cat of categories) {
      expect(cat.id).toBeDefined()
      expect(cat.name).toBeDefined()
      expect(cat.storeId).toBe('abu-qir-demo')
      expect(cat.active).toBe(true)
      expect(typeof cat.sortOrder).toBe('number')
    }
  })

  it('categories are sorted by sortOrder', () => {
    for (let i = 1; i < categories.length; i++) {
      expect(categories[i].sortOrder).toBeGreaterThanOrEqual(categories[i - 1].sortOrder)
    }
  })

  it('all categories have unique IDs', () => {
    const ids = categories.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all categories have Arabic names', () => {
    for (const cat of categories) {
      expect(cat.name).toMatch(/[\u0600-\u06FF]/)
    }
  })
})
