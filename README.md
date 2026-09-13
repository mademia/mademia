# Mademia — Tienda online de mobiliario infantil

Proyecto React + Supabase + Netlify. Tienda funcional de principio a fin:
catálogo público, carrito, pedido con WhatsApp, y panel administrativo completo.

> 🎨 **`preview-diseno.html`** — vista previa visual (HTML autocontenido, ábrelo
> directo en el navegador) del rediseño de Home con la identidad de marca
> MadeMía! (paleta, logo, tagline, combos, galería de inspiración). Es una
> maqueta de referencia con contenido de ejemplo, no está conectada a
> Supabase — sirve para validar el diseño antes de aplicarlo al proyecto React.

## ✅ Funcionalidades implementadas

**Tienda pública:**
- `/` Home — hero, categorías destacadas, productos destacados y beneficios,
  todo editable desde el panel admin (`home_content`).
- `/tienda` — listado de productos con búsqueda, filtro por categoría,
  filtro por disponibilidad y orden por precio/destacados.
- `/producto/:slug` — galería de imágenes, medidas/material/acabado/SKU,
  productos relacionados, agregar al carrito y botón de WhatsApp.
- `/carrito` — agregar, editar cantidad, eliminar, vaciar, persistido en
  localStorage, botón de WhatsApp con el resumen del carrito.
- `/pedido` — formulario de datos del cliente, guarda el pedido y sus ítems
  en Supabase con número automático (`PED-2026-00001`), y botón para enviarlo
  por WhatsApp.

**Panel administrativo (`/admin`, protegido con Supabase Auth):**
- Inicio: pedidos pendientes, pedidos recientes, productos activos/agotados.
- Productos: CRUD completo, con subida de múltiples imágenes, elegir imagen
  principal, reordenar y eliminar.
- Categorías: CRUD completo con imagen y orden.
- Pedidos: lista con búsqueda/filtro por estado, detalle con productos,
  cambio de estado del pedido y del pago.
- Home: editor del hero (título, subtítulo, imagen) y de los beneficios.
- Configuración: nombre del negocio, logo, WhatsApp, email, redes, dirección,
  horarios.

**Backend (Supabase) — completo:**
- `supabase/schema.sql`, `rls_policies.sql`, `storage_setup.sql`, `seed_demo.sql`.

No se pudo ejecutar `npm install` / `npm run build` en el entorno donde se
generó este proyecto por restricciones de red — al clonarlo localmente,
ejecuta `npm install` y revisa la consola ante cualquier ajuste menor.

---

## Cómo ponerlo en marcha

### 1. Crear el proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. En el **SQL Editor**, ejecuta en orden:
   - `supabase/schema.sql`
   - `supabase/rls_policies.sql`
   - `supabase/storage_setup.sql`
   - `supabase/seed_demo.sql` (opcional, datos de prueba)

### 2. Crear el usuario administrador
En Supabase → **Authentication → Users → Add user**, crea un usuario con
email y contraseña. Ese será el login de `/admin/login`.

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Supabase → Project
Settings → API).

### 4. Ejecutar localmente
```bash
npm install
npm run dev
```

### 5. Conectar Git y Netlify
1. Sube el proyecto a un repositorio (GitHub/GitLab).
2. En [netlify.com](https://netlify.com) → **Add new site → Import from Git**.
3. Build command: `npm run build` — Publish directory: `dist` (ya configurado
   en `netlify.toml`, junto con el redirect para React Router).
4. En **Site settings → Environment variables**, agrega
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

### 6. Empezar a cargar productos
Entra a `/admin/login`, inicia sesión con el usuario que creaste, y desde
`/admin/categorias` y `/admin/productos` empieza a cargar tu catálogo real
con fotos.

---

## Estructura del proyecto

```
mademia/
├── supabase/
│   ├── schema.sql
│   ├── rls_policies.sql
│   ├── storage_setup.sql
│   └── seed_demo.sql
├── src/
│   ├── lib/              # supabaseClient, whatsapp, storage, format
│   ├── context/           # CartContext, StoreContext, AuthContext
│   ├── components/         # Header, Footer, ProductCard, WhatsAppButton, etc.
│   ├── pages/              # Home, Tienda, Producto, Carrito, Pedido
│   ├── pages/admin/         # Login, Dashboard, CRUDs, Configuración
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── preview-diseno.html
├── netlify.toml
├── .env.example
└── package.json
```

## Notas sobre el diseño
Paleta cálida (terracota `#C97B57`, beige `#FBF7F2`, verde salvia `#7C9885`),
tipografía serif para títulos y sans-serif para texto, componentes redondeados,
mobile-first ya que gran parte del tráfico llega desde Instagram y WhatsApp.

Para la identidad de marca MadeMía! (paleta oliva/terracota/marfil, logo con
hoja, tagline "Más que muebles, es vida en tu hogar"), ver `preview-diseno.html`.
