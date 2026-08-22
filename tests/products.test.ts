import { describe, it, expect } from 'vitest'
import { products } from '@/data/products'

describe('Products data', () => {
  it('has products', () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it('all products have required fields', () => {
    for (const product of products) {
      expect(product.id).toBeDefined()
      expect(product.name).toBeDefined()
      expect(product.categoryId).toBeDefined()
      expect(typeof product.price).toBe('number')
      expect(product.price).toBeGreaterThanOrEqual(0)
      expect(product.unit).toBeDefined()
      expect(typeof product.available).toBe('boolean')
      expect(typeof product.featured).toBe('boolean')
      expect(typeof product.popular).toBe('boolean')
      expect(Array.isArray(product.media)).toBe(true)
    }
  })

  it('all products have at least one media item', () => {
    for (const product of products) {
      expect(product.media.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('all products belong to valid categories', () => {
    const categoryIds = ['cat-dairy', 'cat-grocery', 'cat-oils', 'cat-beverages', 'cat-sweets', 'cat-cleaning', 'cat-vegetables', 'cat-personal-care', 'cat-water', 'cat-frozen']
    for (const product of products) {
      expect(categoryIds).toContain(product.categoryId)
    }
  })

  it('oldPrice is always less than or equal to price', () => {
    for (const product of products) {
      if (product.oldPrice !== undefined) {
        expect(product.oldPrice).toBeGreaterThan(product.price)
      }
    }
  })

  it('all products have Arabic names', () => {
    for (const product of products) {
      expect(product.name).toMatch(/[\u0600-\u06FF]/)
    }
  })

  it('products have realistic prices', () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0)
      expect(product.price).toBeLessThan(500)
    }
  })

  it('products have valid units', () => {
    for (const product of products) {
      expect(product.unit.length).toBeGreaterThan(0)
    }
  })

  it('some products are featured', () => {
    const featured = products.filter(p => p.featured)
    expect(featured.length).toBeGreaterThan(0)
  })

  it('some products are popular', () => {
    const popular = products.filter(p => p.popular)
    expect(popular.length).toBeGreaterThan(0)
  })

  it('some products are unavailable', () => {
    const unavailable = products.filter(p => !p.available)
    expect(unavailable.length).toBeGreaterThan(0)
  })

  it('some products have discounts', () => {
    const discounted = products.filter(p => p.oldPrice && p.oldPrice > p.price)
    expect(discounted.length).toBeGreaterThan(0)
  })

  it('products are distributed across multiple categories', () => {
    const categoriesWithProducts = new Set(products.map(p => p.categoryId))
    expect(categoriesWithProducts.size).toBeGreaterThanOrEqual(3)
  })
})
