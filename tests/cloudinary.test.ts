import { describe, it, expect, vi } from 'vitest'
import { getCloudinaryUrl, getThumbnailUrl } from '@/lib/cloudinary'

vi.mock('@/lib/cloudinary', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/lib/cloudinary')>()
  return {
    ...mod,
    getCloudinaryUrl: (publicId: string, options: Record<string, string> = {}) => {
      const cloudName = 'test-cloud'
      const { width = 'auto', format = 'auto', quality = 'auto', ...rest } = options
      const transforms = `f_${format},q_${quality},w_${width}${Object.entries(rest).map(([k, v]) => `,${k}_${v}`).join('')}`
      return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
    },
    getThumbnailUrl: (publicId: string) => {
      const cloudName = 'test-cloud'
      return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${publicId}`
    },
  }
})

describe('getCloudinaryUrl', () => {
  it('generates correct base URL', () => {
    const url = getCloudinaryUrl('folder/image')
    expect(url).toBe('https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto,w_auto/folder/image')
  })

  it('applies custom width', () => {
    const url = getCloudinaryUrl('folder/image', { width: '800' })
    expect(url).toContain('w_800')
  })

  it('applies custom format', () => {
    const url = getCloudinaryUrl('folder/image', { format: 'webp' })
    expect(url).toContain('f_webp')
  })

  it('applies custom quality', () => {
    const url = getCloudinaryUrl('folder/image', { quality: '80' })
    expect(url).toContain('q_80')
  })

  it('applies additional transformations', () => {
    const url = getCloudinaryUrl('folder/image', { 'c_fill': '', 'w_400': '', 'h_400': '' })
    expect(url).toContain('c_fill')
    expect(url).toContain('w_400')
    expect(url).toContain('h_400')
  })
})

describe('getThumbnailUrl', () => {
  it('generates correct thumbnail URL', () => {
    const url = getThumbnailUrl('folder/image')
    expect(url).toBe('https://res.cloudinary.com/test-cloud/image/upload/f_auto,q_auto,w_400/folder/image')
  })
})
