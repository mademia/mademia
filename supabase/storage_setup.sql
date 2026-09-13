-- ============================================================
-- MADEMIA - Configuración de Storage
-- Ejecutar en el SQL Editor de Supabase (o crear buckets desde la UI)
-- ============================================================

-- Crear buckets (público para lectura de imágenes)
insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('categories', 'categories', true),
  ('logo', 'logo', true),
  ('home', 'home', true)
on conflict (id) do nothing;

-- Lectura pública en todos los buckets de la tienda
create policy "public_read_products" on storage.objects
  for select using (bucket_id = 'products');
create policy "public_read_categories" on storage.objects
  for select using (bucket_id = 'categories');
create policy "public_read_logo" on storage.objects
  for select using (bucket_id = 'logo');
create policy "public_read_home" on storage.objects
  for select using (bucket_id = 'home');

-- Escritura (subir/eliminar) solo administrador autenticado
create policy "admin_write_products" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "admin_update_products" on storage.objects
  for update using (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "admin_delete_products" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "admin_write_categories" on storage.objects
  for insert with check (bucket_id = 'categories' and auth.role() = 'authenticated');
create policy "admin_update_categories" on storage.objects
  for update using (bucket_id = 'categories' and auth.role() = 'authenticated');
create policy "admin_delete_categories" on storage.objects
  for delete using (bucket_id = 'categories' and auth.role() = 'authenticated');

create policy "admin_write_logo" on storage.objects
  for insert with check (bucket_id = 'logo' and auth.role() = 'authenticated');
create policy "admin_update_logo" on storage.objects
  for update using (bucket_id = 'logo' and auth.role() = 'authenticated');
create policy "admin_delete_logo" on storage.objects
  for delete using (bucket_id = 'logo' and auth.role() = 'authenticated');

create policy "admin_write_home" on storage.objects
  for insert with check (bucket_id = 'home' and auth.role() = 'authenticated');
create policy "admin_update_home" on storage.objects
  for update using (bucket_id = 'home' and auth.role() = 'authenticated');
create policy "admin_delete_home" on storage.objects
  for delete using (bucket_id = 'home' and auth.role() = 'authenticated');

-- Nota: tamaño y formato de imágenes se validan en el frontend
-- (ver src/lib/storage.js) antes de subir: jpg/png/webp, máx 5MB.
