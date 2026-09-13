import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage } from '../../lib/storage'

export default function HomeAdmin() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('home_content').select('*').eq('id', 1).single()
      setForm({
        hero_title: data?.hero_title || '',
        hero_subtitle: data?.hero_subtitle || '',
        hero_image_url: data?.hero_image_url || '',
        benefits: data?.benefits?.length ? data.benefits : [{ title: '', text: '' }],
      })
    }
    load()
  }, [])

  if (!form) return <p>Cargando...</p>

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleBenefitChange(index, field, value) {
    setForm((f) => {
      const benefits = [...f.benefits]
      benefits[index] = { ...benefits[index], [field]: value }
      return { ...f, benefits }
    })
  }

  function addBenefit() {
    setForm((f) => ({ ...f, benefits: [...f.benefits, { title: '', text: '' }] }))
  }

  function removeBenefit(index) {
    setForm((f) => ({ ...f, benefits: f.benefits.filter((_, i) => i !== index) }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { publicUrl } = await uploadImage('home', file)
      setForm((f) => ({ ...f, hero_image_url: publicUrl }))
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
    setSuccess(false)
    try {
      const { error: err } = await supabase.from('home_content').update({
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        hero_image_url: form.hero_image_url || null,
        benefits: form.benefits.filter((b) => b.title || b.text),
      }).eq('id', 1)
      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="section-title">Editar Home</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, maxWidth: 560 }}>
        <div className="field">
          <label>Título del hero</label>
          <input name="hero_title" value={form.hero_title} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Subtítulo del hero</label>
          <textarea name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} rows={2} />
        </div>
        <div className="field">
          <label>Imagen del hero</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
          {uploading && <p style={{ fontSize: '0.85rem' }}>Subiendo...</p>}
          {form.hero_image_url && <img src={form.hero_image_url} alt="" style={{ width: 160, marginTop: 8, borderRadius: 8 }} />}
        </div>

        <div className="field">
          <label>Beneficios</label>
          {form.benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input placeholder="Título" value={b.title} onChange={(e) => handleBenefitChange(i, 'title', e.target.value)} />
              <input placeholder="Texto" value={b.text} onChange={(e) => handleBenefitChange(i, 'text', e.target.value)} />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeBenefit(i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addBenefit}>+ Agregar beneficio</button>
        </div>

        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--color-success)' }}>Guardado correctamente.</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </form>
    </div>
  )
}
