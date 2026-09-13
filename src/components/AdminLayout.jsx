import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/admin', label: 'Inicio', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/home', label: 'Home' },
  { to: '/admin/configuracion', label: 'Configuración' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div style={styles.wrap}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>Mademia Admin</div>
        <nav style={styles.nav}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline btn-sm" style={{ margin: 16 }} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  wrap: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 220,
    background: '#2E2A26',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  brand: {
    padding: '24px 20px',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    borderBottom: '1px solid #4A443D',
  },
  nav: { display: 'flex', flexDirection: 'column', padding: '12px 0', flex: 1 },
  navLink: {
    padding: '12px 20px',
    color: '#C9C0B5',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  navLinkActive: {
    background: '#3E3830',
    color: 'white',
    borderLeft: '3px solid var(--color-primary)',
  },
  main: { flex: 1, padding: '32px', background: 'var(--color-bg)', overflowX: 'auto' },
}
