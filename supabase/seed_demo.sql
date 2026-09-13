-- ============================================================
-- MADEMIA - Datos demo mínimos para probar la tienda
-- Ejecutar DESPUÉS de schema.sql y rls_policies.sql
-- ============================================================

insert into categories (name, slug, description, active, featured, sort_order) values
  ('Camas', 'camas', 'Camas infantiles de diseño y seguras', true, true, 1),
  ('Cunas', 'cunas', 'Cunas convertibles y clásicas', true, true, 2),
  ('Escritorios', 'escritorios', 'Escritorios para estudiar y crear', true, true, 3),
  ('Guardarropas', 'guardarropas', 'Guardarropas y organizadores', true, false, 4);

insert into products (category_id, name, slug, sku, short_description, description, price, compare_price, dimensions, material, finish, availability, featured, active)
select id, 'Cama Casita Montessori', 'cama-casita-montessori', 'MAD-CAM-001',
  'Cama tipo casita, ideal para el método Montessori',
  'Cama baja tipo casita fabricada en madera de pino. Diseño seguro y cálido para el cuarto de tus hijos, favorece la autonomía del niño al estar a nivel del suelo.',
  1450.00, 1650.00, '140cm x 70cm x 110cm', 'Madera de pino', 'Barniz natural',
  'disponible', true, true
from categories where slug = 'camas';

insert into products (category_id, name, slug, sku, short_description, description, price, compare_price, dimensions, material, finish, availability, featured, active)
select id, 'Cuna Convertible Nube', 'cuna-convertible-nube', 'MAD-CUN-001',
  'Cuna convertible en cama junior',
  'Cuna fabricada en MDF laminado, se convierte en cama junior a medida que tu hijo crece. Incluye colchón de espuma de alta densidad.',
  1890.00, null, '130cm x 70cm x 100cm', 'MDF laminado', 'Laca blanca mate',
  'disponible', true, true
from categories where slug = 'cunas';

insert into products (category_id, name, slug, sku, short_description, description, price, compare_price, dimensions, material, finish, availability, featured, active)
select id, 'Escritorio Pequeño Explorador', 'escritorio-pequeno-explorador', 'MAD-ESC-001',
  'Escritorio compacto con cajón',
  'Escritorio infantil con cajón para guardar útiles escolares. Altura ideal para niños de 4 a 10 años.',
  680.00, null, '80cm x 50cm x 55cm', 'Madera de pino', 'Barniz natural',
  'disponible', false, true
from categories where slug = 'escritorios';

insert into products (category_id, name, slug, sku, short_description, description, price, compare_price, dimensions, material, finish, availability, featured, active)
select id, 'Guardarropa Osito', 'guardarropa-osito', 'MAD-GUA-001',
  'Guardarropa con puertas y estantes internos',
  'Guardarropa infantil de dos puertas con barral y estantes internos, ideal para organizar ropa y juguetes.',
  1290.00, null, '90cm x 50cm x 140cm', 'MDF laminado', 'Laca blanca mate',
  'proximamente', false, true
from categories where slug = 'guardarropas';

insert into products (category_id, name, slug, sku, short_description, description, price, compare_price, dimensions, material, finish, availability, featured, active)
select id, 'Cama Nido Doble', 'cama-nido-doble', 'MAD-CAM-002',
  'Cama nido con segunda cama extraíble',
  'Ideal para cuartos compartidos: incluye una segunda cama extraíble con ruedas, guardada debajo de la principal.',
  1750.00, 1950.00, '190cm x 90cm x 45cm', 'Madera de pino', 'Barniz natural',
  'agotado', false, true
from categories where slug = 'camas';

update site_settings set
  business_name = 'Mademia',
  whatsapp_number = '59170000000',
  contact_email = 'hola@mademia.com',
  instagram_url = 'https://instagram.com/mademia',
  address = 'Santa Cruz de la Sierra, Bolivia',
  schedule = 'Lunes a sábado, 9:00 - 18:00'
where id = 1;

update home_content set
  hero_title = 'Mobiliario infantil hecho con amor',
  hero_subtitle = 'Diseño, calidez y calidad para el cuarto de tus hijos',
  benefits = '[
    {"title": "Diseño y calidad", "text": "Muebles pensados para durar y acompañar el crecimiento de tus hijos."},
    {"title": "Materiales seguros", "text": "Maderas y acabados no tóxicos, aptos para espacios infantiles."},
    {"title": "Atención cercana", "text": "Te acompañamos por WhatsApp en todo el proceso de compra."}
  ]'::jsonb
where id = 1;
