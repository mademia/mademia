-- ============================================================
-- MADEMIA - Row Level Security
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table site_settings enable row level security;
alter table home_content enable row level security;

-- ------------------------------------------------------------
-- CATEGORIES: lectura pública de activas, escritura solo admin
-- ------------------------------------------------------------
create policy "categories_public_read" on categories
  for select using (active = true or auth.role() = 'authenticated');

create policy "categories_admin_write" on categories
  for insert with check (auth.role() = 'authenticated');
create policy "categories_admin_update" on categories
  for update using (auth.role() = 'authenticated');
create policy "categories_admin_delete" on categories
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- PRODUCTS: lectura pública de activos, escritura solo admin
-- ------------------------------------------------------------
create policy "products_public_read" on products
  for select using (active = true or auth.role() = 'authenticated');

create policy "products_admin_write" on products
  for insert with check (auth.role() = 'authenticated');
create policy "products_admin_update" on products
  for update using (auth.role() = 'authenticated');
create policy "products_admin_delete" on products
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- PRODUCT_IMAGES: lectura pública, escritura solo admin
-- ------------------------------------------------------------
create policy "product_images_public_read" on product_images
  for select using (true);

create policy "product_images_admin_write" on product_images
  for insert with check (auth.role() = 'authenticated');
create policy "product_images_admin_update" on product_images
  for update using (auth.role() = 'authenticated');
create policy "product_images_admin_delete" on product_images
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- ORDERS: escritura pública (crear pedido), lectura/gestión solo admin
-- ------------------------------------------------------------
create policy "orders_public_insert" on orders
  for insert with check (true);

create policy "orders_admin_read" on orders
  for select using (auth.role() = 'authenticated');
create policy "orders_admin_update" on orders
  for update using (auth.role() = 'authenticated');
create policy "orders_admin_delete" on orders
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- ORDER_ITEMS: escritura pública (parte del checkout), lectura solo admin
-- ------------------------------------------------------------
create policy "order_items_public_insert" on order_items
  for insert with check (true);

create policy "order_items_admin_read" on order_items
  for select using (auth.role() = 'authenticated');
create policy "order_items_admin_update" on order_items
  for update using (auth.role() = 'authenticated');
create policy "order_items_admin_delete" on order_items
  for delete using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- SITE_SETTINGS: lectura pública, escritura solo admin
-- ------------------------------------------------------------
create policy "settings_public_read" on site_settings
  for select using (true);
create policy "settings_admin_update" on site_settings
  for update using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- HOME_CONTENT: lectura pública, escritura solo admin
-- ------------------------------------------------------------
create policy "home_public_read" on home_content
  for select using (true);
create policy "home_admin_update" on home_content
  for update using (auth.role() = 'authenticated');
