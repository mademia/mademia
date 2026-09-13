import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { formatPrice } from '../../lib/format'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [pendingOrders, setPendingOrders] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: activeCount },
        { count: outOfStockCount },
        { count: pendingCount },
        { data: pending },
        { data: recent },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('availability', 'agotado'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pendiente'),
        supabase.from('orders').select('*').eq('status', 'pendiente').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({ activeCount, outOfStockCount, pendingCount })
      setPendingOrders(pending || [])
      setRecentOrders(recent || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1 className="section-title" style={{ marginBottom: 24 }}>Inicio</h1>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 36 }}>
        <StatCard label="Pedidos pendientes" value={stats.pendingCount} />
        <StatCard label="Productos activos" value={stats.activeCount} />
        <StatCard label="Productos agotados" value={stats.outOfStockCount} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Pedidos pendientes</h3>
          {pendingOrders.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>No hay pedidos pendientes.</p>
          ) : (
            pendingOrders.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Pedidos recientes</h3>
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>Todavía no hay pedidos.</p>
          ) : (
            recentOrders.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{value ?? 0}</div>
      <div style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{label}</div>
    </div>
  )
}

function OrderRow({ order }) {
  return (
    <Link to="/admin/pedidos" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
      <span>{order.order_number} — {order.customer_name}</span>
      <strong>{formatPrice(order.total)}</strong>
    </Link>
  )
}
