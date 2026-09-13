import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'

export default function Header() {
  const { itemCount } = useCart()
  const { settings } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo} onClick={() => setMenuOpen(false)}>
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.business_name} style={styles.logoImg} />
          ) : (
            <span style={styles.logoText}>{settings.business_name || 'Mademia'}</span>
          )}
        </Link>

        <nav className={`site-nav${menuOpen ? ' nav-open' : ''}`}>
          <NavLink to="/" end style={styles.navLink} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/tienda" style={styles.navLink} onClick={() => setMenuOpen(false)}>Tienda</NavLink>
        </nav>

        <div style={styles.actions}>
          <Link to="/carrito" style={styles.cartLink} aria-label="Carrito">
            🛒
            {itemCount > 0 && <span style={styles.cartBadge}>{itemCount}</span>}
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(251,247,242,0.95)',
    backdropFilter: 'blur(6px)',
    borderBottom: '1px solid var(--color-border)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
    position: 'relative',
  },
  logo: { display: 'flex', alignItems: 'center' },
  logoImg: { height: 40 },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--color-primary-dark)',
  },
  navLink: {
    fontWeight: 600,
    color: 'var(--color-text)',
    fontSize: '0.95rem',
  },
  actions: { display: 'flex', alignItems: 'center', gap: 14 },
  cartLink: {
    position: 'relative',
    fontSize: '1.4rem',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    background: 'var(--color-primary)',
    color: 'white',
    borderRadius: '999px',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '2px 6px',
    minWidth: 18,
    textAlign: 'center',
  },
}
