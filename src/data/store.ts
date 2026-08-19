import type { Store } from '@/types'

export const store: Store = {
  id: 'abu-qir-demo',
  name: 'بقالة أبو قير',
  slug: 'abu-qir-grocery',
  description: 'كل احتياجات البيت في مكان واحد',
  logo: 'https://res.cloudinary.com/demo/image/upload/grocery-demo/stores/abu-qir-demo/logo',
  banner: 'https://res.cloudinary.com/demo/image/upload/grocery-demo/stores/abu-qir-demo/banner',
  whatsappNumber: '201234567890',
  phone: '03-1234567',
  address: 'أبو قير - الإسكندرية',
  theme: {
    preset: 'green',
    primary: '#16a34a',
    secondary: '#15803d',
    accent: '#f59e0b',
  },
  delivery: {
    enabled: true,
    fee: 10,
    minimumOrder: 50,
    freeDeliveryThreshold: 200,
  },
  openingHours: {
    saturday: { open: '08:00', close: '23:00' },
    sunday: { open: '08:00', close: '23:00' },
    monday: { open: '08:00', close: '23:00' },
    tuesday: { open: '08:00', close: '23:00' },
    wednesday: { open: '08:00', close: '23:00' },
    thursday: { open: '08:00', close: '23:00' },
    friday: { open: '08:00', close: '23:00' },
  },
  active: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}
