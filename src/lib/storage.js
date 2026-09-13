import { supabase } from './supabaseClient'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG o WEBP.'
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `La imagen supera los ${MAX_SIZE_MB}MB permitidos.`
  }
  return null
}

export async function uploadImage(bucket, file, pathPrefix = '') {
  const error = validateImageFile(file)
  if (error) throw new Error(error)

  const ext = file.name.split('.').pop()
  const fileName = `${pathPrefix}${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { publicUrl: data.publicUrl, storagePath: fileName }
}

export async function deleteImage(bucket, storagePath) {
  if (!storagePath) return
  const { error } = await supabase.storage.from(bucket).remove([storagePath])
  if (error) throw error
}
