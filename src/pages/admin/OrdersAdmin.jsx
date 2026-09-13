import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { formatPrice } from '../../lib/format'

const STATUS_OPTIONS = ['pendiente', 'confirmado', 'en_preparacion', 'entregado', 'cancelado']
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'refunded']

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [selected, setSelected] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  async function loadOrders() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  async function openOrder(order) {
    setSelected(order)
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id)
    setSelectedItems(data || [])
  }

  async function updateStatus(order, field, value) {
    await supabase.from('orders').update({ [field]: value }).eq('id', order.id)
    await loadOrders()
    if (selected?.id === order.id) setSelected((s) => ({ ...s, [field]: value }))
  }

  const filtered = orders.filter((o) => {
    const matchesSearch = !search || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <h1 className="section-title">Pedidos</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="Buscar por nombre o número..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: '1 1 220px', padding: 10, borderRadius: 8, border: '1.5px solid var(--color-border)' }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1.5px solid var(--color-border)' }}>
          <option value="todos">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
        <div>
          {loading ? <p>Cargando...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: 10 }}>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} onClick={() => openOrder(o)} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', background: selected?.id === o.id ? 'var(--color-surface)' : 'transparent' }}>
                    <td style={{ padding: 10 }}>{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td><span className="badge badge-muted">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 8 }}>{selected.order_number}</h3>
            <p><strong>Cliente:</strong> {selected.customer_name}</p>
            <p><strong>Teléfono:</strong> {selected.phone}</p>
            {selected.email && <p><strong>Email:</strong> {selected.email}</p>}
            {selected.city && <p><strong>Ciudad:</strong> {selected.city}</p>}
            {selected.address && <p><strong>Dirección:</strong> {selected.address}</p>}
            {selected.reference && <p><strong>Referencia:</strong> {selected.reference}</p>}
            {selected.notes && <p><strong>Observaciones:</strong> {selected.notes}</p>}

            <h4 style={{ marginTop: 16 }}>Productos</h4>
            {selectedItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                <span>{item.product_name} x{item.quantity}</span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
              <span>Total</span>
              <span>{formatPrice(selected.total)}</span>
            </div>

            <div className="field" style={{ marginTop: 20 }}>
              <label>Estado del pedido</label>
              <select value={selected.status} onChange={(e) => updateStatus(selected, 'status', e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Estado del pago</label>
              <select value={selected.payment_status} onChange={(e) => updateStatus(selected, 'payment_status', e.target.value)}>
                {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
