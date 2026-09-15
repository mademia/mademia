import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'

const AVAILABILITY_LABELS = {
  disponible: { text: 'Disponible', className: 'badge-success' },
  agotado: { text: 'Agotado', className: 'badge-danger' },
  proximamente: { text: 'Próximamente', className: 'badge-warning' },
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const availability = AVAILABILITY_LABELS[product.availability] || AVAILABILITY_LABELS.disponible
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    null

  function handleAddToCart(e) {
    e.preventDefault()
    addItem({ ...product, image: primaryImage }, 1)
  }

  return (
    <div className="card" style={styles.card}>
      <Link to={`/producto/${product.slug}`}>
        <div style={styles.imageWrap}>
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} style={styles.image} />
          ) : (
            <div style={styles.placeholder}>Sin imagen</div>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span style={styles.discountBadge}>Oferta</span>
          )}
        </div>
      </Link>
      <div style={styles.body}>
        <span className={`badge ${availability.className}`} style={{ marginBottom: 8 }}>
          {availability.text}
        </span>
        <Link to={`/producto/${product.slug}`}>
          <h3 style={styles.name}>{product.name}</h3>
        </Link>
        <div style={styles.priceRow}>
          <span style={styles.price}>{formatPrice(product.price)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span style={styles.comparePrice}>{formatPrice(product.compare_price)}</span>
          )}
        </div>
        <div style={styles.actions}>
          <Link to={`/producto/${product.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            Ver producto
          </Link>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={handleAddToCart}
            disabled={product.availability !== 'disponible'}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { display: 'flex', flexDirection: 'column', height: '100%' },
  imageWrap: {
    position: 'relative',
    aspectRatio: '1 / 1',
    background: '#F1EAE0',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-light)',
    fontSize: '0.85rem',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    background: 'var(--color-danger)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 999,
  },
  body: { padding: 16, display: 'flex', flexDirection: 'column', flex: 1 },
  name: {
    fontSize: '1rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    margin: '0 0 6px',
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 },
  price: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' },
  comparePrice: {
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    textDecoration: 'line-through',
  },
  actions: { display: 'flex', gap: 8, marginTop: 'auto' },
}
