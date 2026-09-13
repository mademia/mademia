import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../lib/format'
import { whatsappProductLink } from '../lib/whatsapp'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductCard from '../components/ProductCard'

const AVAILABILITY_LABELS = {
  disponible: { text: 'Disponible', className: 'badge-success' },
  agotado: { text: 'Agotado', className: 'badge-danger' },
  proximamente: { text: 'Próximamente', className: 'badge-warning' },
}

export default function Producto() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { settings } = useStore()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setNotFound(false)
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProduct(data)
      const primary = data.product_images?.find((i) => i.is_primary) || data.product_images?.[0]
      setActiveImage(primary?.image_url || null)

      if (data.category_id) {
        const { data: relatedData } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('category_id', data.category_id)
          .eq('active', true)
          .neq('id', data.id)
          .limit(4)
        setRelated(relatedData || [])
      }

      setLoading(false)
    }
    load()
    setQuantity(1)
  }, [slug])

  if (loading) return <div className="container section">Cargando...</div>

  if (notFound) {
    return (
      <div className="container section empty-state">
        <h1>Producto no encontrado</h1>
        <Link to="/tienda" className="btn btn-primary" style={{ marginTop: 16 }}>Volver a la tienda</Link>
      </div>
    )
  }

  const availability = AVAILABILITY_LABELS[product.availability] || AVAILABILITY_LABELS.disponible
  const images = product.product_images?.length
    ? [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)
    : []

  function handleAddToCart() {
    addItem({ ...product, image: activeImage }, quantity)
  }

  return (
    <div className="container section">
      <div className="product-detail-grid">
        <div>
          <div style={styles.mainImageWrap}>
            {activeImage ? (
              <img src={activeImage} alt={product.name} style={styles.mainImage} />
            ) : (
              <div style={styles.placeholder}>Sin imagen</div>
            )}
          </div>
          {images.length > 1 && (
            <div style={styles.thumbRow}>
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  style={{
                    ...styles.thumb,
                    borderColor: img.image_url === activeImage ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  <img src={img.image_url} alt={img.alt_text || product.name} style={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className={`badge ${availability.className}`} style={{ marginBottom: 12 }}>
            {availability.text}
          </span>
          <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
          {product.short_description && <p style={{ color: 'var(--color-text-light)', marginBottom: 16 }}>{product.short_description}</p>}

          <div style={styles.priceRow}>
            <span style={styles.price}>{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span style={styles.comparePrice}>{formatPrice(product.compare_price)}</span>
            )}
          </div>

          {product.description && <p style={{ marginBottom: 20 }}>{product.description}</p>}

          <table style={styles.specTable}>
            <tbody>
              {product.dimensions && <tr><td style={styles.specLabel}>Medidas</td><td>{product.dimensions}</td></tr>}
              {product.material && <tr><td style={styles.specLabel}>Material</td><td>{product.material}</td></tr>}
              {product.finish && <tr><td style={styles.specLabel}>Acabado</td><td>{product.finish}</td></tr>}
              {product.sku && <tr><td style={styles.specLabel}>SKU</td><td>{product.sku}</td></tr>}
            </tbody>
          </table>

          <div style={styles.actionsRow}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              style={styles.qtyInput}
            />
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={product.availability !== 'disponible'}
            >
              Agregar al carrito
            </button>
          </div>

          <WhatsAppButton
            href={whatsappProductLink(settings.whatsapp_number, product)}
            block
            className="btn-sm"
          />
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h2 className="section-title">Productos relacionados</h2>
          <div className="grid grid-products">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  mainImageWrap: {
    aspectRatio: '1 / 1',
    background: '#F1EAE0',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'var(--color-text-light)',
  },
  thumbRow: { display: 'flex', gap: 10, marginTop: 12 },
  thumb: {
    width: 64, height: 64, borderRadius: 8, overflow: 'hidden',
    border: '2px solid var(--color-border)', padding: 0, background: 'white',
  },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 },
  price: { fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary-dark)' },
  comparePrice: { fontSize: '1.1rem', color: 'var(--color-text-light)', textDecoration: 'line-through' },
  specTable: { width: '100%', marginBottom: 24, fontSize: '0.92rem' },
  specLabel: { fontWeight: 600, padding: '6px 12px 6px 0', color: 'var(--color-text-light)', width: 110 },
  actionsRow: { display: 'flex', gap: 12, marginBottom: 14 },
  qtyInput: { width: 70, padding: '0 10px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)' },
}
