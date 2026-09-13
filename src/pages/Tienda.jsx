import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Tienda() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [availabilityFilter, setAvailabilityFilter] = useState('todas')
  const [sortBy, setSortBy] = useState('destacados')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('active', true),
        supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true }),
      ])
      setProducts(productsData || [])
      setCategories(categoriesData || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (categoryFilter !== 'todas') {
      list = list.filter((p) => p.category_id === categoryFilter)
    }

    if (availabilityFilter !== 'todas') {
      list = list.filter((p) => p.availability === availabilityFilter)
    }

    if (sortBy === 'precio_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'precio_desc') {
      list.sort((a, b) => b.price - a.price)
    } else {
      list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return list
  }, [products, search, categoryFilter, availabilityFilter, sortBy])

  return (
    <div className="container section">
      <h1 className="section-title">Tienda</h1>
      <p className="section-subtitle">Explora todos nuestros muebles infantiles.</p>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={styles.select}>
          <option value="todas">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} style={styles.select}>
          <option value="todas">Toda disponibilidad</option>
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
          <option value="proximamente">Próximamente</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="destacados">Destacados primero</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No encontramos productos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-products">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  filters: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  input: {
    flex: '1 1 220px',
    padding: '11px 14px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
  },
  select: {
    padding: '11px 14px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'white',
  },
}
