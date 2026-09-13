-- ============================================================
-- MADEMIA - Esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Extensión para UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text unique,
  short_description text,
  description text,
  price numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  dimensions text,
  material text,
  finish text,
  availability text not null default 'disponible'
    check (availability in ('disponible','agotado','proximamente')),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_slug on products(slug);
create index idx_products_active on products(active);

-- ============================================================
-- PRODUCT_IMAGES
-- ============================================================
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);

create index idx_product_images_product on product_images(product_id);

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  city text,
  address text,
  reference text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pendiente'
    check (status in ('pendiente','confirmado','en_preparacion','entregado','cancelado')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);

-- ============================================================
-- ORDER_ITEMS
-- ============================================================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  subtotal numeric(10,2) not null default 0
);

create index idx_order_items_order on order_items(order_id);

-- ============================================================
-- SITE_SETTINGS (fila única de configuración general)
-- ============================================================
create table site_settings (
  id integer primary key default 1,
  business_name text not null default 'Mademia',
  logo_url text,
  whatsapp_number text not null default '59170000000',
  contact_email text,
  instagram_url text,
  facebook_url text,
  address text,
  schedule text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- ============================================================
-- HOME_CONTENT (fila única de contenido editable del Home)
-- ============================================================
create table home_content (
  id integer primary key default 1,
  hero_title text not null default 'Mobiliario infantil hecho con amor',
  hero_subtitle text not null default 'Diseño, calidez y calidad para el cuarto de tus hijos',
  hero_image_url text,
  benefits jsonb not null default '[]'::jsonb,
  featured_category_ids uuid[] default '{}',
  featured_product_ids uuid[] default '{}',
  updated_at timestamptz not null default now(),
  constraint single_row_home check (id = 1)
);

-- Filas iniciales únicas
insert into site_settings (id) values (1);
insert into home_content (id) values (1);

-- ============================================================
-- NÚMERO DE PEDIDO AUTOMÁTICO (PED-2026-00001)
-- ============================================================
create sequence order_number_seq start 1;

create or replace function generate_order_number()
returns trigger as $$
declare
  next_val integer;
  current_year text;
begin
  next_val := nextval('order_number_seq');
  current_year := to_char(now(), 'YYYY');
  new.order_number := 'PED-' || current_year || '-' || lpad(next_val::text, 5, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_order_number
before insert on orders
for each row
when (new.order_number is null or new.order_number = '')
execute function generate_order_number();

-- ============================================================
-- updated_at automático
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_categories_updated before update on categories
for each row execute function set_updated_at();

create trigger trg_products_updated before update on products
for each row execute function set_updated_at();

create trigger trg_orders_updated before update on orders
for each row execute function set_updated_at();

create trigger trg_settings_updated before update on site_settings
for each row execute function set_updated_at();

create trigger trg_home_updated before update on home_content
for each row execute function set_updated_at();
