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

| ID | Nombre | heroEffect | Estructura | Paleta | Estado |
|---|---|---|---|---|---|
| **M1-Bento** | Warm Bento | `vanta-net` | Split hero + Bento 2×2 + Metrics | Warm Amber `#f59e0b` | ✅ **Activo** |
| M1-Legacy | Dark Tech | `vanta-net` | Hero full + Horizontal scroll | Lime `#c8ff00` | 📦 Archivado (commit `87f33ca`) |
| M2 | Spline 3D | `spline` | Split hero + Bento | TBD | 🔲 Pendiente |
| M3 | Fog Luxury | `vanta-fog` | Split hero + Bento | Playfair Display | 🔲 Pendiente |
| M4 | Minimal | `gradient` | Split hero + Bento | Space Grotesk | 🔲 Pendiente |
| M5 | Terminal CLI | `terminal` | Shell full viewport | Monospace | 🔲 Pendiente |
| M6 | Glitch / RE | `glitch` | Split hero + Bento | Chromatic | 🔲 Pendiente |

---

## M1-Bento — Warm Bento (activo)

**Filosofía:** La estructura correcta para un portfolio PM técnico. Split hero separa el WebGL del contenido — el usuario lee sin que el efecto compita. Bento reemplaza el horizontal scroll: toda la propuesta de valor visible sin mecánicas de navegación custom. Metrics strip crea credibilidad inmediata con números reales.

### Estructura

```
Hero split (WebGL izq / texto der)
  → Marquee skills
  → Bento 2×2 (AI Products large / RE + MCP)
  → Metrics strip (23 · 4 · 3 · 1)
  → Cards grid (proyectos)
  → Clients logos
  → CTA
  → Footer
```

### Paleta activa

```css
--bg:     #0c0a06;   /* warm dark */
--accent: #f59e0b;   /* amber */
--fg:     #f5efe4;   /* warm white */
--muted:  #6b5d47;   /* warm gray */
```

### Paletas alternativas disponibles (solo cambiar tokens.css Layer 1)

| Paleta | bg | accent | Feel |
|---|---|---|---|
| **Warm Amber** (activa) | `#0c0a06` | `#f59e0b` | Terminal + oro |
| Dark Lime (legacy) | `#080808` | `#c8ff00` | Developer tech |
| Deep Navy | `#080e14` | `#4f9eff` | SaaS premium |
| Purple Haze | `#0a0812` | `#9b5de5` | AI-forward |

### Gaps a resolver (evaluación post-implementación)

| Gap | Impacto | Dificultad |
|---|---|---|
| **Paleta definitiva** — ¿amber o cambiar? | Alto | Muy baja — 1 línea tokens.css |
| **Hero visual izq** — lado izquierdo siente vacío sin contenido propio | Alto | Media — agregar elemento visual (número grande, foto, shape animado) |
| **Bento hover** — transición de background muy sutil | Medio | Baja |
| **Contenido real** — métricas reales, proyectos reales | Crítico | No es código — es redacción |
| **Foto real** en hero visual | Alto — humaniza | Muy baja — cambiar CSS |
| **Mobile** — bento 2 col colapsa bien, hero split colapsa a 1 col | Revisar | Baja |

### El insight de estructura

> El horizontal scroll era una trampa de UX: el usuario tenía que descubrir
> que podía scrollear horizontalmente. El bento muestra las 3 áreas de una vez.
> El split hero le da al WebGL su propio espacio sin invadir la lectura del título.

---

## M1-Legacy — Dark Tech (archivado)

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

## M5 — Terminal CLI (pendiente)

**Filosofía:** El portfolio ES una CLI. Auténtico para un PM que construye CLIs reales (BBVA, PlazaVea, Interbank). Sin backend — respuestas pre-escritas en `portfolio.js`. Si se activa el AI layer, los comandos pasan por FastAPI + RAG.

### Para activar

```javascript
// portfolio.js
model:      "M5"
heroEffect: "terminal"
heroTitle:  "~$"
```

```css
/* tokens.css — Layer 2b: activar preset monospace */
--font-body:    "JetBrains Mono", "Fira Code", monospace;
--font-display: "JetBrains Mono", "Fira Code", monospace;
```

### Comandos disponibles (fake shell)

```
help        → lista comandos
about       → bio en una línea
projects    → lista proyectos con stack
skills      → stack técnico
contact     → email + LinkedIn
clear       → limpia pantalla
```

### Fuentes benchmark
- `benchmark/terminal-portfolio-vanilla/` — engine typewriter, commandsList pattern
- `benchmark/jquery-terminal/` — alternativa: `jquery.terminal.min.js` como engine
- `benchmark/terminal-portfolio-react/` — referencia UX de comandos

### Restricciones (ver `benchmark/COMPAT.md`)
- Sin custom cursor (terminal maneja el propio)
- Sin horizontal scroll (rompe UX de shell)
- Sin SplitText/ScrambleText (estética incompatible)
- RAG: se integra como comando `ask <pregunta>`, no como widget flotante

---

## M6 — Glitch / RE identity (pendiente)

**Filosofía:** PM que hace reverse engineering de APIs bancarias. Estética hacker coherente con el trabajo real. Clip-path + chromatic aberration GSAP — sin Three.js extra (usa GSAP ya cargado).

### Para activar

```javascript
// portfolio.js
model:      "M6"
heroEffect: "glitch"
heroTitle:  "RE."
```

```css
/* tokens.css — Layer 2b: misma System UI, añadir scanlines */
--font-body:    system-ui, monospace;
--font-display: system-ui, monospace;
```

### Técnicas clave

```javascript
// Chromatic aberration — text-shadow offset RGB
.glitch-text {
  text-shadow: 2px 0 #ff003c, -2px 0 #00ffff;
  animation: glitch-anim 0.3s infinite;
}

// Clip-path strips (GSAP)
gsap.to('.strip', {
  clipPath: 'inset(0 0 100% 0)',
  stagger: 0.05,
  duration: 0.3,
  ease: 'power2.in'
});

// Scanlines overlay (CSS puro)
.scanlines::after {
  content: '';
  position: fixed; inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px
  );
  pointer-events: none; z-index: 9999;
}
```

### ScrambleText — el efecto natural de M6

```javascript
// En hover de cualquier texto
gsap.to('.nav-link', {
  scrambleText: { text: '{original}', chars: '01ABCDEF', speed: 0.5 },
  duration: 0.6,
  ease: 'none'
});
```

### Fuentes benchmark
- `benchmark/hacker-portfolio/` — kernel code aesthetic, typing-reactive logic
- SARSHIJ cyberpunk — no tiene repo público, técnicas documentadas en `benchmark/EVALUATIONS.md`
- Three.js glitch shader — estudiar en threejs.org/examples, copiar GLSL si se necesita

---

## Evaluación comparativa — 7 dimensiones (mismo criterio que benchmark)

| Dimensión | Peso | M1 Dark Tech | M2 Spline 3D | M3 Fog Luxury | M4 Minimal | M5 Terminal | M6 Glitch |
|---|---|---|---|---|---|---|---|
| Impacto visual | ×2 | 7 | 8 | 8 | 5 | 6 | 9 |
| Adecuación al rol | ×2 | 7 | 6 | 5 | 8 | **10** | 8 |
| Diferencial | ×1.5 | 6 | 8 | 7 | 4 | **9** | 8 |
| UX / Navegabilidad | ×1.5 | 7 | 6 | 7 | 9 | 7 | 6 |
| Performance | ×1 | 6 | 5 | 6 | 10 | **9** | 8 |
| Mobile | ×1 | 6 | 4 | 6 | 9 | 5 | 6 |
| Implementación | ×1 | 8 | 2 | 2 | 2 | 2 | 2 |
| **Score ponderado** | — | **6.75** | **5.9** | **6.3** | **6.6** | **7.1** | **7.4** |

**Lectura:**
- M6 Glitch lidera en score proyectado — diferencial visual máximo + coherente con perfil RE
- M5 Terminal tiene la mayor adecuación al rol (10) — 3 CLIs reales en producción lo avalan
- M1 gana en implementación (único funcional hoy)
- M4 lidera en performance + mobile — para audiencia no técnica
- M2 penalizado por escena Spline inexistente
- M3 baja en adecuación al rol — communica creative director, no PM técnico
- **Gap compartido M1–M6:** contenido placeholder. Cualquier modelo con proyectos reales + métricas sube ~1.5 puntos

Referencia benchmark: `benchmark/EVALUATIONS.md` — mismos pesos aplicados a elenacalvillo.com (8.4/10).

---

## Lecciones de referencia — elenacalvillo.com (score 8.4/10)

Evaluación completa en `benchmark/EVALUATIONS.md`.

**Lo que hace Elena que nosotros no:** muestra artefactos reales de trabajo —
RAG flow en producción, roadmap visual, build stack, evolution timeline.
No describe su trabajo, lo *demuestra*. Score de contenido: 10/10.

**Lo que nosotros hacemos que Elena no:** WebGL, animaciones, cursor magnético,
SplitText reveals, scroll horizontal. Score de impacto visual: 6/10 → nosotros 7.2/10.

**Portfolio ideal = narrativa Elena + efectos M1.**

### Gap crítico antes de cualquier nuevo modelo
Rellenar `portfolio.js` con contenido real:
- Proyectos con métricas concretas (no "Proyecto 1")
- Una sección "Proof of Work" con artefactos visuales reales
- Foto real en el hero (humaniza más que cualquier WebGL)

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
