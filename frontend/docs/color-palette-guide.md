#  Guía de Paleta de Colores - Lo Que Pida

## Colores Principales
Nuestra identidad visual se basa en tres colores principales que representan nuestra marca:

###  Azul (Principal)
- **Uso**: Color principal de marca, CTA primarios, navegación activa
- **Hex**: `#3C50E0`
- **Variaciones disponibles**:
  - `blue-dark`: #1C3FB7 (hover states, active)
  - `blue-light`: #5475E5 (backgrounds sutiles)
  - `blue-light-2`: #8099EC
  - `blue-light-3`: #ADBCF2
  - `blue-light-4`: #C3CEF6 (borders, dividers)
  - `blue-light-5`: #E1E8FF (backgrounds muy sutiles)

###  Blanco
- **Uso**: Fondos principales, textos en fondos oscuros
- **Hex**: `#FFFFFF`

###  Rojo (Acción y Estado)
- **Uso**: Precios especiales, ofertas, errores, urgencia, stock bajo
- **Hex**: `#F23030`
- **Variaciones disponibles**:
  - `red-dark`: #E10E0E (hover states críticos)
  - `red-light`: #F56060
  - `red-light-2`: #F89090
  - `red-light-3`: #FBC0C0
  - `red-light-4`: #FDD8D8 (backgrounds de error sutiles)
  - `red-light-5`: #FEEBEB (backgrounds de notificación)
  - `red-light-6`: #FEF3F3 (backgrounds muy sutiles)

##  Aplicaciones Estratégicas

### Botones y CTAs
```css
/* Botón principal */
.btn-primary { @apply bg-blue text-white hover:bg-blue-dark; }

/* Botón de oferta/descuento */
.btn-offer { @apply bg-red text-white hover:bg-red-dark; }

/* Botón secundario */
.btn-secondary { @apply border border-blue text-blue hover:bg-blue hover:text-white; }

/* Botón de peligro */
.btn-danger { @apply bg-red-dark text-white hover:bg-red; }
```

### Estados y Feedback
```css
/* Precios de oferta */
.price-offer { @apply text-red font-semibold; }

/* Stock bajo */
.low-stock { @apply text-red-dark bg-red-light-6 px-2 py-1 rounded text-xs; }

/* Error messages */
.error-message { @apply text-red-dark bg-red-light-5 border border-red-light-3; }

/* Success states */
.success-state { @apply text-green bg-green-light-6; }
```

### Navegación y UI
```css
/* Link activo */
.nav-link-active { @apply text-blue border-b-2 border-blue; }

/* Hover en navegación */
.nav-link:hover { @apply text-blue; }

/* Badge de contador */
.counter-badge { @apply bg-blue text-white; }

/* Badge de urgencia */
.urgent-badge { @apply bg-red text-white; }
```

##  Combinaciones Recomendadas

### 1. Hero Sections y Banners
- **Fondo**: Blanco o `blue-light-5`
- **Texto principal**: `dark` (#1C274C)
- **Precios regulares**: `dark-3` (#606882)
- **Precios de oferta**: `red` (#F23030)
- **CTAs**: `blue` con hover `blue-dark`

### 2. Cards de Productos
- **Fondo**: Blanco
- **Título**: `dark` (#1C274C)
- **Precio regular**: `dark-3` (#606882) con tachado
- **Precio oferta**: `red` (#F23030)
- **Botón agregar**: `blue` con hover `blue-dark`

### 3. Headers y Navegación
- **Fondo**: Blanco
- **Enlaces**: `dark` (#1C274C)
- **Enlaces hover**: `blue` (#3C50E0)
- **Enlaces activos**: `blue` con borde inferior `blue`
- **Íconos**: `blue` (#3C50E0)

### 4. Estados de Stock
- **En stock**: `green` (#22AD5C)
- **Stock bajo**: `red` (#F23030)
- **Sin stock**: `dark-4` (#8D93A5)

### 5. Formularios
- **Bordes normales**: `gray-3` (#E5E7EB)
- **Focus**: `blue` con shadow `blue/20`
- **Error**: `red` con background `red-light-6`
- **Success**: `green` con background `green-light-6`

##  Responsive y Accesibilidad

### Contraste
-  Azul sobre blanco: 4.5:1 (WCAG AA)
-  Rojo sobre blanco: 4.5:1 (WCAG AA)
-  Dark sobre blanco: 12.6:1 (WCAG AAA)

### Mobile First
En pantallas pequeñas, priorizar:
1. **Azul** para acciones principales
2. **Rojo** para ofertas y urgencia
3. **Blanco** para máxima legibilidad

##  Clases de Utilidad Personalizadas

```css
/* Gradientes suaves */
.gradient-blue { @apply bg-gradient-to-r from-blue-light-5 to-blue-light-4; }
.gradient-offer { @apply bg-gradient-to-r from-red-light-6 to-red-light-5; }

/* Combinaciones patrióticas */
.patriotic-border { @apply border-t-4 border-blue border-r-4 border-red; }
.flag-accent { @apply bg-white border-l-4 border-blue border-r-4 border-red; }

/* Estados interactivos */
.interactive-blue { @apply text-blue hover:text-blue-dark transition-colors duration-200; }
.interactive-red { @apply text-red hover:text-red-dark transition-colors duration-200; }
```

##  Checklist de Implementación

###  Implementado Actualmente
-  Paleta de colores definida en Tailwind
-  Precios de oferta en rojo
-  Navegación con azul
-  Íconos en azul
-  Botones principales en azul

###  Por Mejorar
-  Badges de stock bajo en rojo
-  CTAs de urgencia en rojo
-  Elementos promocionales destacados
-  Estados de error más prominentes
-  Indicadores de ofertas limitadas

##  Filosofía de Color

**Azul**: Confianza, profesionalismo, navegación
**Rojo**: Urgencia, ofertas, atención, acción inmediata  
**Blanco**: Limpieza, espacio, legibilidad

Esta combinación tricolor evoca confianza profesional (azul) con toques de urgencia comercial (rojo) sobre una base limpia (blanco), perfecta para un e-commerce moderno.
