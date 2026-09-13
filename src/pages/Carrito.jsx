import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../lib/format'
import { whatsappCartLink } from '../lib/whatsapp'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Carrito() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()
  const { settings } = useStore()

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h1>Tu carrito está vacío</h1>
        <Link to="/tienda" className="btn btn-primary" style={{ marginTop: 16 }}>Ir a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1 className="section-title">Carrito</h1>
      {items.map((item) => (
        <div key={item.id} className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#F1EAE0', borderRadius: 8, flexShrink: 0 }}>
            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />}
          </div>
          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <div>{formatPrice(item.price)} c/u</div>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            style={{ width: 60, padding: 6 }}
          />
          <strong>{formatPrice(item.price * item.quantity)}</strong>
          <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Eliminar</button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <button className="btn btn-outline btn-sm" onClick={clearCart}>Vaciar carrito</button>
        <strong style={{ fontSize: '1.2rem' }}>Total: {formatPrice(total)}</strong>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/tienda" className="btn btn-outline">Continuar comprando</Link>
        <Link to="/pedido" className="btn btn-primary">Continuar al pedido</Link>
        <WhatsAppButton href={whatsappCartLink(settings.whatsapp_number, items, total)} />
      </div>
    </div>
  )
}
