import { describe, it, expect } from 'vitest'
import { generateWhatsAppMessage } from '@/lib/whatsapp'

describe('generateWhatsAppMessage', () => {
  const items = [
    { name: 'طماطم', price: 15, unit: 'كجم', quantity: 2 },
    { name: 'بطاطس', price: 20, unit: 'كجم', quantity: 1 },
  ]

  it('produces correct format with all fields', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة أبو قير',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير - الإسكندرية',
      items,
      subtotal: 50,
      deliveryFee: 10,
      total: 60,
      paymentMethod: 'نقداً عند الاستلام',
      notes: 'الرجاء الاتصال قبل التوصيل',
      whatsappNumber: '201234567890',
    })

    expect(message).toContain('طلب جديد 🛒')
    expect(message).toContain('المتجر: بقالة أبو قير')
    expect(message).toContain('العميل:\nأحمد')
    expect(message).toContain('الهاتف:\n0123456789')
    expect(message).toContain('العنوان:\nأبو قير - الإسكندرية')
    expect(message).toContain('الطلبات:')
    expect(message).toContain('2 × طماطم كجم')
    expect(message).toContain('30 جنيه')
    expect(message).toContain('1 × بطاطس كجم')
    expect(message).toContain('20 جنيه')
    expect(message).toContain('قيمة المنتجات: 50 جنيه')
    expect(message).toContain('التوصيل: 10 جنيه')
    expect(message).toContain('الإجمالي: 60 جنيه')
    expect(message).toContain('طريقة الدفع:\nنقداً عند الاستلام')
    expect(message).toContain('ملاحظات:\nالرجاء الاتصال قبل التوصيل')
  })

  it('formats items correctly', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير',
      items,
      subtotal: 50,
      deliveryFee: 10,
      total: 60,
      paymentMethod: 'نقداً',
      notes: '',
      whatsappNumber: '201234567890',
    })

    expect(message).toContain('2 × طماطم كجم')
    expect(message).toContain('1 × بطاطس كجم')
  })

  it('calculates totals correctly', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير',
      items,
      subtotal: 50,
      deliveryFee: 10,
      total: 60,
      paymentMethod: 'نقداً',
      notes: '',
      whatsappNumber: '201234567890',
    })

    expect(message).toContain('قيمة المنتجات: 50 جنيه')
    expect(message).toContain('التوصيل: 10 جنيه')
    expect(message).toContain('الإجمالي: 60 جنيه')
  })

  it('handles empty notes', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير',
      items,
      subtotal: 50,
      deliveryFee: 10,
      total: 60,
      paymentMethod: 'نقداً',
      notes: '',
      whatsappNumber: '201234567890',
    })

    expect(message).not.toContain('ملاحظات:')
  })

  it('shows free delivery when fee is zero', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير',
      items,
      subtotal: 50,
      deliveryFee: 0,
      total: 50,
      paymentMethod: 'نقداً',
      notes: '',
      whatsappNumber: '201234567890',
    })

    expect(message).toContain('التوصيل مجاناً')
    expect(message).not.toContain('التوصيل:')
  })

  it('contains cart emoji', () => {
    const message = generateWhatsAppMessage({
      storeName: 'بقالة',
      customerName: 'أحمد',
      phone: '0123456789',
      address: 'أبو قير',
      items,
      subtotal: 50,
      deliveryFee: 10,
      total: 60,
      paymentMethod: 'نقداً',
      notes: '',
      whatsappNumber: '201234567890',
    })

    expect(message).toContain('🛒')
  })
})
