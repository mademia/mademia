import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { settings } = useStore()

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.grid}>
        <div>
          <h3 style={styles.brand}>{settings.business_name || 'Mademia'}</h3>
          <p style={styles.text}>Mobiliario infantil de diseño, calidez y calidad.</p>
        </div>
        <div>
          <h4 style={styles.heading}>Navegación</h4>
          <Link to="/" style={styles.link}>Inicio</Link>
          <Link to="/tienda" style={styles.link}>Tienda</Link>
          <Link to="/carrito" style={styles.link}>Carrito</Link>
        </div>
        <div>
          <h4 style={styles.heading}>Contacto</h4>
          {settings.address && <p style={styles.text}>{settings.address}</p>}
          {settings.schedule && <p style={styles.text}>{settings.schedule}</p>}
          {settings.contact_email && <p style={styles.text}>{settings.contact_email}</p>}
        </div>
        <div>
          <h4 style={styles.heading}>Síguenos</h4>
          {settings.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" style={styles.link}>Instagram</a>
          )}
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noreferrer" style={styles.link}>Facebook</a>
          )}
        </div>
      </div>
      <p style={styles.copy}>© {new Date().getFullYear()} {settings.business_name || 'Mademia'}. Todos los derechos reservados.</p>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#2E2A26',
    color: '#E8DFD3',
    padding: '48px 0 24px',
    marginTop: 60,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 24,
  },
  brand: { fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 10 },
  heading: { color: 'white', fontSize: '0.95rem', marginBottom: 12 },
  text: { fontSize: '0.85rem', margin: '0 0 6px', color: '#C9C0B5' },
  link: { display: 'block', fontSize: '0.85rem', marginBottom: 8, color: '#C9C0B5' },
  copy: {
    textAlign: 'center',
    fontSize: '0.78rem',
    color: '#8A8177',
    marginTop: 36,
  },
}
