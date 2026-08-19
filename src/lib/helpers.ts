export function formatPrice(price: number): string {
  return `${price.toFixed(0)} جنيه`
}

export function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim()
}

export function searchMatches(productName: string, query: string): boolean {
  const normalizedProduct = normalizeArabic(productName)
  const normalizedQuery = normalizeArabic(query)
  return normalizedProduct.includes(normalizedQuery)
}

export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) {
    return '20' + digits.slice(1)
  }
  if (digits.startsWith('20')) {
    return digits
  }
  return digits
}

export function validateEgyptianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return /^(01|02|03)[0-9]{9}$/.test(digits) || /^201[0-9]{9}$/.test(digits)
}

export function getTodayDayName(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getUTCDay()]
}

export function isStoreOpen(openingHours: Record<string, { open: string; close: string; closed?: boolean }>): boolean {
  const today = getTodayDayName()
  const hours = openingHours[today]
  if (!hours || hours.closed) return false
  const now = new Date()
  const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}
