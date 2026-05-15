# MODELS.md — Sistema de Modelos klipso_web

Cada modelo es una configuración visual completa del portfolio.
**Un cambio en `portfolio.js` activa un modelo distinto.**

---

## Cómo funciona

```javascript
// vanilla/web/data/portfolio.js → objeto meta
export const meta = {
  model:      "M1",         // ← identificador del modelo activo
  heroEffect: "vanta-net",  // ← efecto del hero (ver opciones abajo)
  heroTitle:  "Portfolio.", // ← título del h1 del hero
  // ...resto de campos
};
```

Para cambiar de modelo: editar `model`, `heroEffect`, y activar el preset de tipografía correspondiente en `tokens.css`.

---

## Tabla de modelos

| ID | Nombre | heroEffect | Tipografía | Estado |
|---|---|---|---|---|
| **M1** | Dark Tech | `vanta-net` | System UI | ✅ Activo |
| M2 | Spline 3D | `spline` | System UI | 🔲 Pendiente |
| M3 | Fog Luxury | `vanta-fog` | Playfair Display + DM Sans | 🔲 Pendiente |
| M4 | Minimal | `gradient` | Space Grotesk | 🔲 Pendiente |

---

## M1 — Dark Tech (activo)

**Filosofía:** Portfolio PM técnico. WebGL discreto, paleta lime + negro, sin fuentes externas.

### Configuración

```javascript
// portfolio.js
model:      "M1"
heroEffect: "vanta-net"
heroTitle:  "Portfolio."
```

```css
/* tokens.css — Layer 2b */
--font-body:    system-ui, -apple-system, sans-serif;  /* activo */
--font-display: system-ui, -apple-system, sans-serif;  /* activo */
--primitive-accent: #c8ff00;                           /* lime */
```

### UX fixes aplicados (Ronda 1)

| Fix | Archivo | Qué hace |
|---|---|---|
| Scroll-aware navbar | `framework.js` | `rgba(8,8,8,0.92)` + `blur(20px)` al pasar 100px |
| Panel dots | `framework.js` + `index.html` | 3 dots, el lime salta al panel activo via `scrub` |
| Scroll hint animado | `framework.js` | `yoyo y:7px` cada 0.9s, `color rgba(255,255,255,.5)` |
| Card hover accent | `index.html` CSS | `box-shadow: inset 0 2px 0 var(--accent)` — línea lime superior |
| Bigtext fix | `framework.js` | `toggleActions: 'play none none none'` — no revierte |

### Archivos activos M1

```
vanilla/web/
  index.html              ← HTML + CSS inline
  data/portfolio.js       ← meta + projects
  assets/
    framework.js          ← GSAP engine
    tokens.css            ← design tokens (Layer 1-3)
    vendors/
      vanta.net.min.js    ← cargado lazy cuando heroEffect:'vanta-net'
```

---

## M2 — Spline 3D (pendiente)

**Filosofía:** Hero interactivo en 3D. Mismo dark theme, pero el foco es el objeto Spline.

### Para activar

```javascript
// portfolio.js
model:      "M2"
heroEffect: "spline"
heroTitle:  "Work."
```

```css
/* tokens.css — Layer 2b: sin cambios (System UI) */
```

**Pendiente:** elegir/crear escena Spline propia. La URL actual es un placeholder.

---

## M3 — Fog Luxury (pendiente)

**Filosofía:** Editorial premium. Niebla WebGL + tipografía serif. Para roles creative/strategy.

### Para activar

```javascript
// portfolio.js
model:      "M3"
heroEffect: "vanta-fog"
heroTitle:  "Selected Work."
```

```css
/* tokens.css — Layer 2b: activar preset Playfair */
--font-body:    "DM Sans", sans-serif;
--font-display: "Playfair Display", Georgia, serif;
```

```html
<!-- index.html <head>: activar Google Fonts link -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

---

## M4 — Minimal (pendiente)

**Filosofía:** Carga instantánea, cero WebGL, máxima legibilidad. Para audiencia no técnica.

### Para activar

```javascript
// portfolio.js
model:      "M4"
heroEffect: "gradient"
heroTitle:  "Hola."
```

```css
/* tokens.css — Layer 2b: activar preset Space Grotesk */
--font-body:    "Space Grotesk", sans-serif;
--font-display: "Space Grotesk", sans-serif;
```

```html
<!-- index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
```

**Ventaja:** `gradient` = CSS puro, cero JS extra, Time to Interactive mínimo.

---

## Agregar un modelo nuevo

1. Elegir un `heroEffect` de la lista disponible
2. Elegir un preset tipográfico de `tokens.css` Layer 2b
3. Editar `meta.model` + `meta.heroEffect` + `meta.heroTitle` en `portfolio.js`
4. Activar el `<link>` de Google Fonts en `index.html` si el preset lo requiere
5. Documentar aquí con tabla de configuración + filosofía

---

## heroEffect — opciones disponibles

| Valor | Efecto | Dependencias | Peso extra |
|---|---|---|---|
| `'vanta-net'` | Red de nodos WebGL lime | Three.js CDN + `vanta.net.min.js` | ~650KB |
| `'vanta-fog'` | Niebla volumétrica WebGL | Three.js CDN + `vanta.fog.min.js` | ~650KB |
| `'vanta-rings'` | Anillos concéntricos WebGL | Three.js CDN + `vanta.rings.min.js` | ~650KB |
| `'spline'` | Objeto 3D interactivo | Spline viewer CDN (dynamic import) | ~200KB |
| `'gradient'` | Degradado CSS radial | Ninguna | 0KB |

Todos cargan de forma **lazy** — solo se descargan si el modelo los activa.
