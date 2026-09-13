import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../context/StoreContext'
import { whatsappGeneralLink } from '../lib/whatsapp'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { settings } = useStore()
  const [homeContent, setHomeContent] = useState(null)
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: home } = await supabase.from('home_content').select('*').eq('id', 1).single()
      setHomeContent(home)

      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('sort_order', { ascending: true })
      setFeaturedCategories(categories || [])

      const { data: products } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('active', true)
        .eq('featured', true)
        .limit(4)
      setFeaturedProducts(products || [])

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="container section">Cargando...</div>

  const heroTitle = homeContent?.hero_title || settings.business_name || 'Mademia'
  const heroSubtitle = homeContent?.hero_subtitle || 'Mobiliario infantil de diseño, calidez y calidad.'
  const benefits = homeContent?.benefits || []

  return (
    <div>
      {/* HERO */}
      <section style={styles.hero}>
        <div className="container home-hero-grid">
          <div>
            <h1 style={styles.heroTitle}>{heroTitle}</h1>
            <p style={styles.heroSubtitle}>{heroSubtitle}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/tienda" className="btn btn-primary">Ver tienda</Link>
              <a
                href={whatsappGeneralLink(settings.whatsapp_number)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
          {homeContent?.hero_image_url && (
            <img src={homeContent.hero_image_url} alt={heroTitle} style={styles.heroImage} />
          )}
        </div>
      </section>

      {/* CATEGORÍAS DESTACADAS */}
      {featuredCategories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Categorías</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {featuredCategories.map((cat) => (
                <Link key={cat.id} to="/tienda" className="card" style={styles.categoryCard}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} style={styles.categoryImage} />
                  ) : (
                    <div style={{ ...styles.categoryImage, background: '#F1EAE0' }} />
                  )}
                  <div style={{ padding: 12, fontWeight: 600 }}>{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS DESTACADOS */}
      {featuredProducts.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <h2 className="section-title">Productos destacados</h2>
            <div className="grid grid-products">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BENEFICIOS */}
      {benefits.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {benefits.map((b, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ color: 'var(--color-text-light)' }}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="section" style={{ background: 'var(--color-primary)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 12 }}>¿Listo para armar el cuarto de tus hijos?</h2>
          <Link to="/tienda" className="btn btn-outline" style={{ background: 'white' }}>Ver toda la tienda</Link>
        </div>
      </section>
    </div>
  )
}

const styles = {
  hero: { background: 'var(--color-surface)', padding: '60px 0' },
  heroTitle: { fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 },
  heroSubtitle: { fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 28, maxWidth: '38ch' },
  heroImage: { width: '100%', borderRadius: 'var(--radius)' },
  categoryCard: { display: 'block' },
  categoryImage: { width: '100%', aspectRatio: '4/3', objectFit: 'cover' },
}
