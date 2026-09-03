// Procedural store logo/banner generator.
// Generates an inline SVG data URL so the storefront ALWAYS has a logo
// without depending on external CDNs.
//
// Used for:
//   - default logo for newly-created stores in /admin/stores
//   - fallback logo when a store's logoUrl is broken/missing
//
// Design: warm "bazaar/editorial" palette. Arabic-name-first. Reads the
// first letter of the store name as the monogram, plus the full Arabic
// name underneath, on a warm cream/terracotta background.

const PALETTES = [
  { bg: '#b04a2f', fg: '#f6f1e8', accent: '#d4a04a' },
  { bg: '#1f4d3a', fg: '#f6f1e8', accent: '#d4a04a' },
  { bg: '#3a2a4d', fg: '#f6f1e8', accent: '#d4a04a' },
  { bg: '#7a3a1f', fg: '#f6f1e8', accent: '#f6f1e8' },
  { bg: '#2a3f5f', fg: '#f6f1e8', accent: '#d4a04a' },
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export interface LogoOptions {
  name: string
  shape?: 'square' | 'banner'
  size?: { width: number; height: number }
}

export function generateStoreLogo({
  name,
  shape = 'square',
  size,
}: LogoOptions): string {
  const palette = PALETTES[hashString(name) % PALETTES.length]
  const isBanner = shape === 'banner'
  const width = size?.width ?? (isBanner ? 800 : 400)
  const height = size?.height ?? (isBanner ? 240 : 400)

  const firstChar = name.trim().charAt(0) || '?'
  const monogramFontSize = isBanner ? height * 0.45 : height * 0.32
  const nameFontSize = isBanner ? height * 0.16 : height * 0.08
  const monogramY = isBanner ? height * 0.62 : height * 0.45
  const nameY = isBanner ? height * 0.88 : height * 0.62

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(name)}">
  <rect width="${width}" height="${height}" fill="${palette.bg}"/>
  <circle cx="${width * 0.5}" cy="${height * 0.42}" r="${height * 0.28}" fill="${palette.accent}" fill-opacity="0.18"/>
  <text x="${width / 2}" y="${monogramY}" text-anchor="middle" dominant-baseline="middle" font-family="'Amiri', 'Cairo', 'Noto Sans Arabic', serif" font-weight="700" font-size="${monogramFontSize}" fill="${palette.fg}">${escapeXml(firstChar)}</text>
  <text x="${width / 2}" y="${nameY}" text-anchor="middle" dominant-baseline="middle" font-family="'Amiri', 'Cairo', 'Noto Sans Arabic', serif" font-weight="500" font-size="${nameFontSize}" fill="${palette.fg}" fill-opacity="0.92">${escapeXml(name)}</text>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
