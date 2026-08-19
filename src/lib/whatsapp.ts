export function generateWhatsAppMessage(params: {
  storeName: string
  customerName: string
  phone: string
  address: string
  items: { name: string; price: number; unit: string; quantity: number }[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  notes: string
  whatsappNumber: string
}): string {
  const { storeName, customerName, phone, address, items, subtotal, deliveryFee, total, paymentMethod, notes } = params

  const lines = [
    'طلب جديد 🛒',
    '',
    `المتجر: ${storeName}`,
    '',
    'العميل:',
    customerName,
    '',
    'الهاتف:',
    phone,
    '',
    'العنوان:',
    address,
    '',
    'الطلبات:',
    '',
    ...items.flatMap(item => [
      `${item.quantity} × ${item.name} ${item.unit}`,
      `${(item.price * item.quantity).toFixed(0)} جنيه`,
      '',
    ]),
    '--------------------',
    `قيمة المنتجات: ${subtotal.toFixed(0)} جنيه`,
    deliveryFee > 0 ? `التوصيل: ${deliveryFee.toFixed(0)} جنيه` : 'التوصيل مجاناً',
    `الإجمالي: ${total.toFixed(0)} جنيه`,
    '',
    `طريقة الدفع:\n${paymentMethod}`,
    '',
    notes ? `ملاحظات:\n${notes}` : '',
  ].filter(Boolean)

  return lines.join('\n')
}

export function openWhatsApp(phone: string, message: string) {
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${phone}?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
