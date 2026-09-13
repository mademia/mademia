import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const StoreContext = createContext(null)

const DEFAULT_SETTINGS = {
  business_name: 'Mademia',
  whatsapp_number: '',
  logo_url: null,
  contact_email: null,
  instagram_url: null,
  facebook_url: null,
  address: null,
  schedule: null,
  qr_image_url: null,
}

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()
      if (!error && data) setSettings(data)
      setLoading(false)
    }
    loadSettings()
  }, [])

  return (
    <StoreContext.Provider value={{ settings, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
