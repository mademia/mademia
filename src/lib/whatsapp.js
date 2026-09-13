// Genera enlaces de WhatsApp a partir del número guardado en site_settings.
// No escribir el número directamente en los componentes: siempre pasar
// `whatsappNumber` (viene de site_settings.whatsapp_number).

function buildWhatsAppLink(whatsappNumber, message) {
  const cleanNumber = (whatsappNumber || '').replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encoded}`
}

export function whatsappGeneralLink(whatsappNumber, message = 'Hola, quiero información sobre sus productos.') {
  return buildWhatsAppLink(whatsappNumber, message)
}

export function whatsappProductLink(whatsappNumber, product) {
  const message =
    `Hola, quiero información sobre:\n\n` +
    `Producto: ${product.name}\n` +
    `Precio: Bs ${Number(product.price).toFixed(2)}\n` +
    `SKU: ${product.sku || '-'}`
  return buildWhatsAppLink(whatsappNumber, message)
}

export function whatsappCartLink(whatsappNumber, items, total) {
  const lines = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (Bs ${Number(item.price).toFixed(
          2
        )} c/u) = Bs ${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n')

  const message =
    `Hola, quiero consultar sobre mi carrito:\n\n` +
    `${lines}\n\n` +
    `Total: Bs ${Number(total).toFixed(2)}`
  return buildWhatsAppLink(whatsappNumber, message)
}

export function whatsappOrderLink(whatsappNumber, order, items) {
  const lines = items
    .map(
      (item) =>
        `- ${item.product_name} x${item.quantity} (Bs ${Number(
          item.unit_price
        ).toFixed(2)} c/u) = Bs ${Number(item.subtotal).toFixed(2)}`
    )
    .join('\n')

  const message =
    `Hola, quiero confirmar mi pedido:\n\n` +
    `Pedido: ${order.order_number}\n` +
    `Nombre: ${order.customer_name}\n` +
    `Teléfono: ${order.phone}\n` +
    `Ciudad: ${order.city || '-'}\n` +
    `Dirección: ${order.address || '-'}\n\n` +
    `Productos:\n${lines}\n\n` +
    `Total: Bs ${Number(order.total).toFixed(2)}\n` +
    `Observaciones: ${order.notes || '-'}`
  return buildWhatsAppLink(whatsappNumber, message)
}
