import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage } from '../../lib/storage'

export default function SettingsAdmin() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
      setForm({
        business_name: data?.business_name || '',
        logo_url: data?.logo_url || '',
        whatsapp_number: data?.whatsapp_number || '',
        contact_email: data?.contact_email || '',
        instagram_url: data?.instagram_url || '',
        facebook_url: data?.facebook_url || '',
        address: data?.address || '',
        schedule: data?.schedule || '',
      })
    }
    load()
  }, [])

  if (!form) return <p>Cargando...</p>

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { publicUrl } = await uploadImage('logo', file)
      setForm((f) => ({ ...f, logo_url: publicUrl }))
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
      const { error: err } = await supabase.from('site_settings').update(form).eq('id', 1)
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
      <h1 className="section-title">Configuración</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, maxWidth: 480 }}>
        <div className="field">
          <label>Nombre del negocio</label>
          <input name="business_name" value={form.business_name} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Logo</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoUpload} />
          {uploading && <p style={{ fontSize: '0.85rem' }}>Subiendo...</p>}
          {form.logo_url && <img src={form.logo_url} alt="" style={{ height: 50, marginTop: 8 }} />}
        </div>
        <div className="field">
          <label>WhatsApp (con código de país, sin +)</label>
          <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="59170000000" />
        </div>
        <div className="field">
          <label>Email de contacto</label>
          <input type="email" name="contact_email" value={form.contact_email} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Instagram (URL)</label>
          <input name="instagram_url" value={form.instagram_url} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Facebook (URL)</label>
          <input name="facebook_url" value={form.facebook_url} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Dirección</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Horarios</label>
          <input name="schedule" value={form.schedule} onChange={handleChange} />
        </div>

        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--color-success)' }}>Guardado correctamente.</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </form>
    </div>
  )
}
