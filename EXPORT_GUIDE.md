# RealEstateOS – Guía de Exportación para Cursor

## Archivos a copiar

Copia estos archivos manteniendo la misma estructura de carpetas:

### Design System (COPIAR PRIMERO)
```
src/index.css              → Tokens de diseño, variables CSS, fuentes
tailwind.config.ts         → Configuración de Tailwind con colores custom
```

### Layout Principal
```
src/pages/Index.tsx        → Página principal con layout y navegación por vistas
src/components/AppSidebar.tsx   → Sidebar responsive (desktop fijo + mobile overlay)
src/components/HeaderBar.tsx    → Header con hamburger menu y búsqueda
```

### Páginas de Contenido
```
src/components/ContactsListPage.tsx  → Listado de contactos con tabla y filtros
src/components/AddContactPage.tsx    → Formulario de añadir contacto
src/components/PropertiesPage.tsx    → Catálogo de propiedades en grid
src/components/UsersPage.tsx         → Usuarios agrupados por categoría (tarjetas)
```

### Assets (imágenes generadas)
```
src/assets/property-1.jpg
src/assets/property-2.jpg
src/assets/property-3.jpg
src/assets/featured-banner.jpg
```

## Variables CSS clave (index.css)

```css
--background: 220 14% 96%;        /* Fondo general gris claro */
--foreground: 220 20% 10%;        /* Texto principal casi negro */
--card: 0 0% 100%;                /* Tarjetas blancas */
--primary: 220 18% 14%;           /* Botones y acentos oscuros */
--muted-foreground: 220 8% 52%;   /* Texto secundario */
--border: 220 13% 91%;            /* Bordes sutiles */
--sidebar-bg: 0 0% 100%;          /* Sidebar blanco */
--sidebar-active: 220 14% 95%;    /* Item activo del sidebar */
```

## Colores Tailwind custom (tailwind.config.ts)

```
sidebar-custom-bg / fg / fg-active / hover / active / active-border / border
label-bg / fg / border
```

## Dependencias necesarias

```bash
npm install lucide-react tailwindcss-animate class-variance-authority clsx tailwind-merge
```

## Comportamiento responsive

- **Desktop (≥1024px):** Sidebar fijo a la izquierda, siempre visible
- **Mobile (<1024px):** Sidebar oculto, se abre con hamburger (☰) en el header
  - Overlay con backdrop blur al abrir
  - Se cierra al hacer clic fuera o al navegar

## Estructura de navegación

```
Dashboard       → PlaceholderPage
Propiedades     → PropertiesPage
Contactos       → ContactsListPage → AddContactPage
Agencias        → PlaceholderPage
─────────────
Usuarios        → UsersPage
Empresa         → PlaceholderPage
Ajustes         → PlaceholderPage
```

## Cómo integrar en tu proyecto

1. Copia `index.css` y `tailwind.config.ts` (adapta si ya tienes config)
2. Copia los componentes a tu carpeta `src/components/`
3. Copia las imágenes a `src/assets/`
4. Usa `Index.tsx` como referencia para el layout principal
5. Reemplaza el sistema de vistas (`useState`) por tu router (React Router, etc.)

## Fuente

Se usa **Inter** cargada desde Google Fonts en `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

## Notas

- Todo el diseño es estático (sin backend, sin base de datos)
- Los colores usan HSL en variables CSS semánticas
- Los componentes no tienen lógica de negocio, solo UI
- Preparado para conectar a cualquier backend posteriormente
