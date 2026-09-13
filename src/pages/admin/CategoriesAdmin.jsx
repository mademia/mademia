import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage, deleteImage } from '../../lib/storage'
import { slugify } from '../../lib/format'

const EMPTY_FORM = {
  id: null,
  name: '',
  slug: '',
  description: '',
  image_url: '',
  image_storage_path: '',
  active: true,
  featured: false,
  sort_order: 0,
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function loadCategories() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  function startCreate() {
    setForm(EMPTY_FORM)
    setEditing(true)
    setError(null)
  }

  function startEdit(cat) {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      image_storage_path: cat.storage_path || '',
      active: cat.active,
      featured: cat.featured,
      sort_order: cat.sort_order,
    })
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
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { publicUrl, storagePath } = await uploadImage('categories', file)
      setForm((f) => ({ ...f, image_url: publicUrl, image_storage_path: storagePath }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        image_url: form.image_url || null,
        active: form.active,
        featured: form.featured,
        sort_order: Number(form.sort_order) || 0,
      }

      if (form.id) {
        const { error: err } = await supabase.from('categories').update(payload).eq('id', form.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('categories').insert(payload)
        if (err) throw err
      }

      setEditing(false)
      await loadCategories()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    await supabase.from('categories').delete().eq('id', cat.id)
    if (cat.image_url && form.image_storage_path) {
      try { await deleteImage('categories', form.image_storage_path) } catch {}
    }
    await loadCategories()
  }

  async function toggleActive(cat) {
    await supabase.from('categories').update({ active: !cat.active }).eq('id', cat.id)
    await loadCategories()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Categorías</h1>
        {!editing && <button className="btn btn-primary" onClick={startCreate}>+ Nueva categoría</button>}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24, marginBottom: 28, maxWidth: 480 }}>
          <div className="field">
            <label>Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
          </div>
          <div className="field">
            <label>Imagen</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
            {uploading && <p style={{ fontSize: '0.85rem' }}>Subiendo...</p>}
            {form.image_url && <img src={form.image_url} alt="" style={{ width: 100, marginTop: 8, borderRadius: 8 }} />}
          </div>
          <div className="field">
            <label>Orden</label>
            <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
          </div>
          <div className="field" style={{ display: 'flex', gap: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Activa
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Destacada
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
              <th style={{ padding: 10 }}>Nombre</th>
              <th>Estado</th>
              <th>Destacada</th>
              <th>Orden</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 10 }}>{cat.name}</td>
                <td>
                  <button className={`badge ${cat.active ? 'badge-success' : 'badge-muted'}`} onClick={() => toggleActive(cat)}>
                    {cat.active ? 'Activa' : 'Inactiva'}
                  </button>
                </td>
                <td>{cat.featured ? '⭐' : '—'}</td>
                <td>{cat.sort_order}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(cat)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
