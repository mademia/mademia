import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage, deleteImage } from '../../lib/storage'
import { slugify, formatPrice } from '../../lib/format'

const EMPTY_FORM = {
  id: null,
  category_id: '',
  name: '',
  slug: '',
  sku: '',
  short_description: '',
  description: '',
  price: '',
  compare_price: '',
  dimensions: '',
  material: '',
  finish: '',
  availability: 'disponible',
  featured: false,
  active: true,
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function loadData() {
    setLoading(true)
    const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
      supabase.from('products').select('*, product_images(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    ])
    setProducts(productsData || [])
    setCategories(categoriesData || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function startCreate() {
    setForm(EMPTY_FORM)
    setImages([])
    setEditing(true)
    setError(null)
  }

  function startEdit(product) {
    setForm({
      id: product.id,
      category_id: product.category_id || '',
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price,
      compare_price: product.compare_price || '',
      dimensions: product.dimensions || '',
      material: product.material || '',
      finish: product.finish || '',
      availability: product.availability,
      featured: product.featured,
      active: product.active,
    })
    setImages((product.product_images || []).sort((a, b) => a.sort_order - b.sort_order))
    setEditing(true)
    setError(null)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !f.id ? { slug: slugify(value) } : {}),
    }))
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (const file of files) {
        const { publicUrl, storagePath } = await uploadImage('products', file)
        setImages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}-${Math.random()}`,
            image_url: publicUrl,
            storage_path: storagePath,
            is_primary: prev.length === 0,
            sort_order: prev.length,
            isNew: true,
          },
        ])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage(img) {
    if (!img.isNew && form.id) {
      await supabase.from('product_images').delete().eq('id', img.id)
    }
    try { await deleteImage('products', img.storage_path) } catch {}
    setImages((prev) => prev.filter((i) => i.id !== img.id))
  }

  function setPrimaryImage(imgId) {
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === imgId })))
  }

  function moveImage(index, direction) {
    setImages((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next.map((img, i) => ({ ...img, sort_order: i }))
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        category_id: form.category_id || null,
        name: form.name,
        slug: form.slug,
        sku: form.sku || null,
        short_description: form.short_description || null,
        description: form.description || null,
        price: Number(form.price) || 0,
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        dimensions: form.dimensions || null,
        material: form.material || null,
        finish: form.finish || null,
        availability: form.availability,
        featured: form.featured,
        active: form.active,
      }

      let productId = form.id

      if (form.id) {
        const { error: err } = await supabase.from('products').update(payload).eq('id', form.id)
        if (err) throw err
      } else {
        const { data: inserted, error: err } = await supabase.from('products').insert(payload).select().single()
        if (err) throw err
        productId = inserted.id
      }

      // Guardar imágenes nuevas
      const newImages = images.filter((img) => img.isNew)
      if (newImages.length > 0) {
        const payloadImages = newImages.map((img) => ({
          product_id: productId,
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
        const { error: imgErr } = await supabase.from('product_images').insert(payloadImages)
        if (imgErr) throw imgErr
      }

      // Actualizar orden/primaria de imágenes existentes
      const existingImages = images.filter((img) => !img.isNew)
      for (const img of existingImages) {
        await supabase.from('product_images').update({
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }).eq('id', img.id)
      }

      setEditing(false)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return
    await supabase.from('products').delete().eq('id', product.id)
    await loadData()
  }

  async function toggleActive(product) {
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    await loadData()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Productos</h1>
        {!editing && <button className="btn btn-primary" onClick={startCreate}>+ Nuevo producto</button>}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24, marginBottom: 28, maxWidth: 600 }}>
          <div className="field">
            <label>Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select name="category_id" value={form.category_id} onChange={handleChange}>
              <option value="">Sin categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Descripción corta</label>
            <input name="short_description" value={form.short_description} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Precio *</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Precio anterior</label>
              <input type="number" step="0.01" name="compare_price" value={form.compare_price} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label>Medidas</label>
            <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Ej: 140cm x 70cm x 110cm" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Material</label>
              <input name="material" value={form.material} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Acabado</label>
              <input name="finish" value={form.finish} onChange={handleChange} />
            </div>
          </div>
          <div className="field">
            <label>Disponibilidad</label>
            <select name="availability" value={form.availability} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
              <option value="proximamente">Próximamente</option>
            </select>
          </div>

          <div className="field">
            <label>Imágenes</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload} />
            {uploading && <p style={{ fontSize: '0.85rem' }}>Subiendo...</p>}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {images.map((img, i) => (
                <div key={img.id} style={{ position: 'relative', border: img.is_primary ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 8, padding: 4 }}>
                  <img src={img.image_url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, fontSize: '0.7rem' }}>
                    <button type="button" onClick={() => setPrimaryImage(img.id)} title="Marcar como principal">⭐</button>
                    <button type="button" onClick={() => moveImage(i, -1)} title="Mover izquierda">◀</button>
                    <button type="button" onClick={() => moveImage(i, 1)} title="Mover derecha">▶</button>
                    <button type="button" onClick={() => handleRemoveImage(img)} title="Eliminar">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="field" style={{ display: 'flex', gap: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Activo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Destacado
            </label>
          </div>

          {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            <button className="btn btn-outline" type="button" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: 10 }}>Producto</th>
              <th>Precio</th>
              <th>Disponibilidad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 10 }}>{p.name}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.availability}</td>
                <td>
                  <button className={`badge ${p.active ? 'badge-success' : 'badge-muted'}`} onClick={() => toggleActive(p)}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
