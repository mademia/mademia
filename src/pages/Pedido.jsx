import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../lib/format'
import { whatsappOrderLink } from '../lib/whatsapp'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Pedido() {
  const { items, total, clearCart } = useCart()
  const { settings } = useStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    reference: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [createdOrder, setCreatedOrder] = useState(null)
  const [createdItems, setCreatedItems] = useState([])

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email || null,
          city: form.city || null,
          address: form.address || null,
          reference: form.reference || null,
          notes: form.notes || null,
          subtotal: total,
          shipping_cost: 0,
          total: total,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItemsPayload = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        sku: item.sku || null,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }))

      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload)
        .select()

      if (itemsError) throw itemsError

      setCreatedOrder(order)
      setCreatedItems(orderItems || [])
      clearCart()
    } catch (err) {
      setError('No pudimos registrar tu pedido. Intenta nuevamente.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (createdOrder) {
    return (
      <div className="container section" style={{ maxWidth: 560 }}>
        <h1 className="section-title">¡Pedido registrado!</h1>
        <p style={{ marginBottom: 20 }}>
          Tu número de pedido es <strong>{createdOrder.order_number}</strong>.
          Envíalo por WhatsApp para confirmar los detalles y coordinar la entrega.
        </p>
        <WhatsAppButton
          href={whatsappOrderLink(settings.whatsapp_number, createdOrder, createdItems)}
          label="Enviar pedido por WhatsApp"
          block
        />
        <Link to="/tienda" className="btn btn-outline btn-block" style={{ marginTop: 12 }}>
          Seguir comprando
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h1>No tienes productos en tu carrito</h1>
        <Link to="/tienda" className="btn btn-primary" style={{ marginTop: 16 }}>Ir a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1 className="section-title">Finalizar pedido</h1>

      <div className="card" style={{ padding: 20, marginBottom: 28 }}>
        <h3 style={{ marginBottom: 12 }}>Resumen</h3>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.92rem' }}>
            <span>{item.name} x{item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)', fontWeight: 700 }}>
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nombre completo *</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Teléfono / WhatsApp *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Email (opcional)</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Ciudad</label>
          <input name="city" value={form.city} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Dirección</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Referencia</label>
          <input name="reference" value={form.reference} onChange={handleChange} placeholder="Ej: portón verde, casa esquinera" />
        </div>
        <div className="field">
          <label>Observaciones</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </div>

        {error && <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  )
}
