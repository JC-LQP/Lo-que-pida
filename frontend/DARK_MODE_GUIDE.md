#  Guía de Modo Oscuro - Lo Que Pida

##  Resumen

Se ha implementado un sistema **simplificado** de modo oscuro para tu sitio web de e-commerce que incluye:

-  **Toggle Switch Elegante** - Botón deslizante horizontal estilo moderno
-  **Alternancia Simple** - Solo Light/Dark (sin modo System)
-  **Persistencia en localStorage** - Recuerda la preferencia del usuario
-  **Colores Mejorados** - Paleta optimizada con transparencias y glassmorphism
-  **Transiciones Suaves** - Animaciones fluidas de 300ms
-  **Completamente Responsive** - Se adapta a todos los dispositivos
-  **Performance Optimizado** - Hook ligero sin dependencias pesadas

##  Uso Rápido

### Hook useTheme Simplificado:

```tsx
import { useTheme } from '@/hooks/useTheme';

const MyComponent = () => {
  const { isDark, theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <p>Modo actual: {isDark ? 'Oscuro' : 'Claro'}</p>
      <p>Tema: {theme}</p>
      
      {/* Alternancia simple */}
      <button onClick={toggleTheme}>
        Cambiar a {isDark ? 'claro' : 'oscuro'}
      </button>
      
      {/* Cambio directo */}
      <button onClick={() => setTheme('dark')}>Modo Oscuro</button>
      <button onClick={() => setTheme('light')}>Modo Claro</button>
    </div>
  );
};
```

### Toggle Switch Moderno:

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// Uso básico - Toggle switch horizontal
<ThemeToggle />

// Con clases personalizadas
<ThemeToggle className="ml-4 lg:ml-6" />

// En Header o Navbar
<nav>
  <div className="flex items-center gap-4">
    <span>Other nav items</span>
    <ThemeToggle />
  </div>
</nav>
```

##  Archivos Implementados

### 1. Hook Simplificado (`hooks/useTheme.ts`)
-  **API Simple**: `{ isDark, theme, toggleTheme, setTheme }`
-  **Solo Light/Dark**: Sin complejidad de modo "system"
-  **Persistencia**: localStorage automático
-  **SSR Safe**: Previene hydration mismatch
-  **Performance**: Mínima lógica, máxima eficiencia

### 2. Toggle Switch Moderno (`components/ThemeToggle/index.tsx`)
-  **Diseño Horizontal**: Toggle switch deslizante
-  **Iconos Embebidos**: Sol/Luna dentro del círculo
-  **Animaciones Fluidas**: Transiciones de 300ms
-  **Gradientes Adaptativos**: Colores que cambian con el tema
-  **Responsive**: Se adapta automáticamente

### 3. Estilos CSS Mejorados (`app/css/style.css`)
-  **Glassmorphism Avanzado**: Efectos con transparencias
-  **Nuevas Clases Utility**: `.dark-card`, `.dark-input`, etc.
-  **Gradientes Optimizados**: Fondos más sutiles
-  **Contraste Mejorado**: Mejor legibilidad en ambos modos

### 4. Header Actualizado (`components/Header/index.tsx`)
-  **Input Mejorado**: Campo de búsqueda con clase `.dark-input`
-  **Toggle Integrado**: Posicionado perfectamente
-  **Estilos Consistentes**: Coherente con el resto del sitio

##  Clases CSS Disponibles

###  Contenedores y Cards
```css
.dark-card               /* Card con glassmorphism y transparencias */
.dark-card-hover         /* Efectos hover para cards */
.dark-surface            /* Superficie principal (gray-900/95) */
.dark-surface-elevated   /* Superficie elevada con backdrop-blur */
```

###  Texto Optimizado para Dark Mode
```css
.dark-text-primary       /* Texto principal - gray-100 */
.dark-text-secondary     /* Texto secundario - gray-300 */
.dark-text-muted         /* Texto atenuado - gray-400 */
```

###  Botones y Controles Mejorados
```css
.dark-btn-primary        /* Botón primario con blue optimizado */
.dark-btn-secondary      /* Botón secundario con gray-700 */
.dark-input              /* Input mejorado con transparencias */
```

###  Bordes y Separadores
```css
.dark-divider            /* Separadores - gray-700/60 */
.dark-border             /* Bordes generales - gray-600/40 */
```

###  Efectos Especiales (Originales)
```css
.glass-effect            /* Glassmorphism adaptivo mejorado */
.glass-banner            /* Banner con vidrio */
.footer-red-gradient     /* Degradado rojo del footer */
.footer-red-overlay      /* Overlay rojo del footer */
```

###  Botones Temáticos (Originales)
```css
.btn-primary             /* Azul principal */
.btn-offer               /* Rojo de ofertas */
.btn-secondary           /* Secundario con bordes */
.btn-danger              /* Rojo de peligro */
```

###  Estados y Feedback
```css
.low-stock               /* Indicador de stock bajo */
.error-message           /* Mensajes de error */
.success-state           /* Estados de éxito */
.price-offer             /* Precios en oferta */
```

##  Personalización Avanzada

###  Cambiar Colores del Toggle Switch

En `components/ThemeToggle/index.tsx`, personaliza los gradientes:

```tsx
// Línea ~104 - Cambiar gradientes del fondo
className={`absolute inset-0 rounded-full transition-all duration-300 ${
  isDark 
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 opacity-90'  // 🌙 Modo oscuro
    : 'bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20'  // ☀️ Modo claro
}`}

// Personalizar colores de iconos
className={`transition-all duration-300 ${
  isDark ? 'text-purple-300' : 'text-orange-500'  //  Colores personalizados
}`}
```

###  Agregar Nuevas Clases Dark Mode

En `app/css/style.css`, agrega tus propias clases:

```css
/* Clase personalizada para cards especiales */
.my-special-card {
  @apply bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-600/50;
  @apply shadow-sm dark:shadow-lg backdrop-blur-sm;
  @apply transition-all duration-300;
}

/* Texto con gradiente que cambia con el tema */
.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply dark:from-blue-400 dark:to-purple-400;
  @apply bg-clip-text text-transparent;
}
```

###  Usar en Nuevos Componentes

```tsx
const NewComponent = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="my-special-card dark-text-primary">
      <h2 className="gradient-text">Título con gradiente</h2>
      <p className="dark-text-secondary">
        Este texto se adapta automáticamente
      </p>
      
      <button className="dark-btn-primary">
        Botón optimizado
      </button>
      
      {/* Lógica condicional basada en tema */}
      {isDark ? (
        <img src="/logo-dark.png" alt="Logo oscuro" />
      ) : (
        <img src="/logo-light.png" alt="Logo claro" />
      )}
    </div>
  );
};
```

### ⚙️ Configuración del Toggle

```tsx
{/* Toggle básico - recomendado */}
<ThemeToggle />

{/* Con clases personalizadas */}
<ThemeToggle className="ml-4 hover:scale-105" />

{/* En diferentes contextos */}
<div className="flex items-center gap-4">
  <span className="dark-text-secondary">Tema:</span>
  <ThemeToggle />
</div>
```

##  Responsive Design

El toggle switch es completamente responsive y se adapta automáticamente:

###  Desktop (lg+)
- **Tamaño**: 48x24px (w-12 h-6)
- **Círculo**: 20x20px con iconos de 12x12px
- **Efectos**: Gradientes completos y hover effects
- **Posición**: Visible en header navigation

###  Tablet/Mobile
- **Tamaño**: Mantiene 48x24px para fácil touch
- **Simplificado**: Sin gradientes complejos en dispositivos menos potentes
- **Accesibilidad**: Área de touch ampliada
- **Posición**: Se oculta en `lg:hidden` si es necesario

##  Debugging y Solución de Problemas

###  Verificar Estado del Tema
```javascript
// En DevTools Console
console.log('Clase dark en HTML:', document.documentElement.classList.contains('dark'));
console.log('Tema en localStorage:', localStorage.getItem('theme'));
console.log('Tema actual del sistema:', window.matchMedia('(prefers-color-scheme: dark)').matches);
```

###  Debug Component en React
```tsx
function DebugTheme() {
  const { isDark, theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded shadow-lg">
      <h3>Debug Tema</h3>
      <p>Tema: {theme}</p>
      <p>Es oscuro: {isDark ? 'Sí' : 'No'}</p>
      <p>HTML tiene .dark: {document.documentElement.classList.contains('dark') ? 'Sí' : 'No'}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

###  Forzar Tema (Testing)
```javascript
// Forzar modo oscuro
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');

// Forzar modo claro
document.documentElement.classList.remove('dark');
localStorage.setItem('theme', 'light');

// Reset completo
localStorage.removeItem('theme');
location.reload();
```

###  Problemas Comunes

#### Toggle no se ve
```bash
# Verificar que Tailwind compile las clases
npm run dev
# o
yarn dev
```

#### Hydration mismatch
-  **Solucionado**: El hook incluye protección SSR
-  **Comportamiento**: Siempre inicia en "light" hasta mount

#### Tema no persiste
```javascript
// Verificar localStorage
if (typeof Storage !== "undefined") {
  console.log("localStorage disponible");
} else {
  console.log("localStorage no disponible");
}
```

##  Mejores Prácticas

### 1.  Usar Clases Utility Optimizadas
```css
/*  BIEN - Usar las nuevas clases utility */
.my-component {
  @apply dark-card dark-text-primary dark-border;
}

/*  BIEN - Combinar con Tailwind estándar */
.my-component {
  @apply bg-white dark:bg-gray-900/95 dark-text-primary;
}

/*  EVITAR - Colores hardcodeados */
.my-component {
  background: white;
  color: black;
}
```

### 2.  Testing Sistemático
```tsx
// Auto-test en desarrollo
function AutoTestTheme() {
  const { toggleTheme } = useTheme();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(toggleTheme, 3000); // Cambia cada 3s
      return () => clearInterval(interval);
    }
  }, [toggleTheme]);
  
  return null;
}
```

**Checklist de Testing:**
-  Modo claro funciona correctamente
-  Modo oscuro funciona correctamente  
-  Transición es suave (sin parpadeos)
-  Toggle switch responde al click
-  Preferencia persiste al recargar
-  Responsive en móvil/tablet/desktop

### 3.  Contraste y Accesibilidad
```tsx
//  BIEN - Contraste adecuado
<button className="bg-blue-600 dark:bg-blue-500 text-white">
  Botón legible
</button>

//  BIEN - Usar clases semánticas
<div className="dark-card dark-text-primary">
  Contenido con contraste optimizado
</div>

//  EVITAR - Contraste insuficiente
<span className="text-gray-400 dark:text-gray-500">
  Texto poco legible
</span>
```

### 4.  Performance y Optimización
```tsx
//  BIEN - Hook optimizado
const { isDark, toggleTheme } = useTheme(); // Solo lo que necesitas

//  BIEN - Lazy loading de imágenes por tema
const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';

//  BIEN - Transiciones CSS hardware-accelerated
.smooth-transition {
  @apply transition-all duration-300 ease-in-out;
  transform: translateZ(0); /* Force hardware acceleration */
}
```




