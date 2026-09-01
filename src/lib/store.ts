export function getStoreSlug(): string {
  return import.meta.env.VITE_STORE_SLUG ?? 'default'
}