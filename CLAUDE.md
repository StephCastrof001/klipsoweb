# ENGAGE — Web Engagement Framework

## Objetivo
Construir páginas web con elementos de alto engagement que los AI tools (Claude, Lovable, Claude Design, v0) NO generan por defecto.

## Stack
- **HTML/CSS/JS** vanilla — sin build step, todo desde CDN
- **GSAP** (GreenSock) — todos los plugins son FREE desde adquisición Webflow
- **Lenis** — smooth scroll
- Archivos en `web/`

## Inspiración estudiada
- **oryzo.ai** → Astro + Three.js r178 fork de Lusion, sin GSAP
- **solais.ai** → WordPress + Tailwind v4 + Lenis + Swiper, tema custom `startdigital`

## Design system (extraído de solais.ai)
```
Colores:
  --bg-dark:   #3c091e   (bordó/vino oscuro — loading screen)
  --accent-1:  #97494e   (hover states)
  --accent-2:  #af6267   (texto sobre oscuro)
  --neutral:   #646464
  --border:    #dedede
  --bg-light:  #f4f4f4

Tipografía:
  Headings:     'ki' woff — serif editorial
  Display bold: 'teknolog' (NB Architekt Bold) — geométrica
  Body:         system-ui / Tailwind v4 sans

Animaciones:
  Smooth scroll: Lenis (clase `lenis` en <html>)
  Reveals:       opacity 0→1 on scroll (custom JS en site.js)
  Carrusel:      Swiper.js
  Intro:         Custom JS fullscreen overlay dark
```

## Elementos que AI tools NO generan (nuestro diferencial)

| Elemento | Tecnología | Por qué los AI lo omiten |
|---|---|---|
| Custom cursor magnético | JS vanilla + GSAP | UX no estándar, difícil de spec |
| Loading screen inmersivo | GSAP timeline | Parece blocker para el usuario |
| SplitText char/word reveals | `gsap/SplitText` | Requería Club GSAP (ahora free) |
| ScrambleText en hover | `gsap/ScrambleTextPlugin` | Desconocido para la mayoría |
| Grain texture animado | CSS + SVG feTurbulence | Difícil de describir en un prompt |
| Horizontal scroll pinned | GSAP ScrollTrigger scrub | Setup complejo |
| Clip-path reveals | GSAP + CSS clip-path | Requiere coordinación CSS/JS |
| DrawSVG on scroll | `gsap/DrawSVGPlugin` | Requería Club GSAP (ahora free) |
| Magnetic buttons | JS mousemove + GSAP | Interacción que no se ve en designs |
| Marquee GSAP (no CSS) | GSAP repeat:-1 | CSS marquee es más simple pero limitado |
| ScrollTrigger.batch stagger | BatchCallback API | API avanzada poco documentada |
| Lenis + ScrollTrigger proxy | `lenis.on('scroll', ScrollTrigger.update)` | Integración no obvia |

## GSAP CDN (todos free, npm gsap@3)
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrambleTextPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/DrawSVGPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/Flip.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"></script>
```

## Patrones GSAP críticos

### Lenis + ScrollTrigger (correcto)
```javascript
const lenis = new Lenis({ lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
// NO usar scrollerProxy — obsoleto en Lenis v1+
```

### SplitText con mask (reveal limpio)
```javascript
const split = SplitText.create('.title', { type: 'lines', mask: 'lines' });
gsap.from(split.lines, { yPercent: 100, stagger: 0.1, duration: 1, ease: 'power4.out' });
```

### Horizontal scroll (patrón estándar)
```javascript
const panels = gsap.utils.toArray('.panel');
gsap.to('.track', {
  x: () => -(panels.length - 1) * window.innerWidth,
  ease: 'none',
  scrollTrigger: {
    trigger: '.sticky-container',
    pin: true,
    start: 'top top',
    end: () => '+=' + (panels.length - 1) * window.innerWidth,
    scrub: 1,
    invalidateOnRefresh: true
  }
});
```

### ScrollTrigger.batch para cards
```javascript
ScrollTrigger.batch('.card', {
  onEnter: (batch) => gsap.to(batch, {
    clipPath: 'inset(0 0 0% 0)',
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  }),
  start: 'top 85%'
});
```

### Magnetic button
```javascript
el.addEventListener('mousemove', (e) => {
  const rect = el.getBoundingClientRect();
  const dx = (e.clientX - rect.left - rect.width / 2) * 0.4;
  const dy = (e.clientY - rect.top - rect.height / 2) * 0.4;
  gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
});
el.addEventListener('mouseleave', () => {
  gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
});
```

### DrawSVG reveal on scroll
```javascript
gsap.registerPlugin(DrawSVGPlugin);
gsap.from('#path', {
  drawSVG: '0%',
  duration: 2,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.section', start: 'top 80%' }
});
// IMPORTANTE: el <path> debe tener stroke y stroke-width en CSS/SVG
```

## Estructura del proyecto
```
oryzo-project/
  CLAUDE.md           ← este archivo
  web/
    index.html        ← showcase page con todos los efectos
  checkpoints/        ← modelos 3D OBJ (del repo ORYZO-1)
  gsap-skills-ref/    ← skills del repo greensock/gsap-skills (referencia)
  README.md
```

## Skills activos (ui-ux-pro-max-skill — nextlevelbuilder)

Repo clonado en `klipso_web/ui-ux-pro-max-skill/`. Motor de búsqueda BM25+regex sobre CSVs.

| Skill | Cuándo usarlo |
|---|---|
| `ui-ux-pro-max` | Auditar UX, elegir estilo/color/font, review accesibilidad |
| `ui-styling` | Componentes accesibles (Radix/shadcn base), dark mode tokens |
| `design-system` | Token architecture 3 capas, CSS vars, spacing scale |
| `brand` | Brand voice, visual identity, messaging framework |
| `design` | Logo, banners, iconos SVG, social assets |
| `slides` | Presentaciones HTML con Chart.js |

**Comando de búsqueda:**
```bash
cd klipso_web/ui-ux-pro-max-skill
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <ux|style|color|typography|chart> -n 10
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "klipso_web" -f markdown
```

**Fixes aplicados desde audit (ui-ux-pro-max, 2026-05-09):**
- `prefers-reduced-motion`: `gsap.defaults({duration:0.001}) + gsap.globalTimeline.timeScale(20)` cuando media query activa
- `:focus-visible`: outline 2px accent — restaura foco de teclado sin romper cursor custom
- Modal focus management: `closeBtn.focus()` en `onComplete` del open
- Modal keyboard trap: `trapFocus()` cicla Tab solo dentro del modal cuando `isOpen`
- Grain: `animation:none` en `@media (prefers-reduced-motion: reduce)`

## Skills activos (antigravity-awesome-skills)

Invocar estrictamente desde base de conocimiento local. No usar skills fuera de esta lista sin actualizar este archivo.

| Skill | Fuente | Qué aporta al proyecto |
|---|---|---|
| `spline-3d-integration` | antigravity-awesome-skills | Embed Spline en hero, pointer-events:none, mobile fallback CSS |
| `antigravity-design-expert` | antigravity-awesome-skills | Glassmorphism modales, magnetic CTAs, z-layering GSAP+3D CSS |
| `scroll-experience` | antigravity-awesome-skills | Timing asimétrico open/close modales, transiciones cinematográficas |
| `fixing-motion-performance` | antigravity-awesome-skills | will-change estratégico, backdrop-filter aislado, GPU compositor layers |

### Gaps UX implementados (web/index.html)

**GAP 1 — Spline 3D Placeholder (hero)**
- `<spline-viewer>` web component vía `@splinetool/viewer@1.9.58` (CDN module)
- `pointer-events:none` + `position:absolute; inset:0; z-index:0`
- Fallback: `radial-gradient` CSS si Spline falla al cargar
- Mobile `<768px`: `display:none` vía media query — sin JS extra
- Para reemplazar la escena: Spline → Share → Embed → copiar URL → `url="…"` en `<spline-viewer>`

**GAP 2 — CTAs en paneles horizontales**
- Cada `.panel` tiene `.btn--panel[data-magnetic]` debajo del `<p>`
- `initMagnetic('[data-magnetic]', 0.45)` los toma automáticamente (selector ya existente)
- Clic en botón abre modal con `data-modal-title` / `data-modal-text` del propio botón
- Estilo: ghost transparente con border sutil → hover accent, sin romper jerarquía del panel

**GAP 3 — Modal / Progressive Disclosure**
- Un overlay universal `#modalOverlay` (glassmorphism: `backdrop-filter:blur(28px)`)
- JS inyecta título + texto dinámicamente al abrir — un solo modal en DOM
- Triggers: clic en `.card` O clic en `.btn--panel`
- `lenis.stop()` al abrir · `lenis.start()` al cerrar (CLAUDE.md pattern)
- GSAP open: `power3.out` 0.5s · close: `power2.in` 0.28s (asimétrico = responsivo)
- Cerrar: botón ✕, clic en overlay, tecla Escape

## Reglas de desarrollo
- Un solo `gsap.registerPlugin()` con todos los plugins al inicio
- Iniciar animaciones DESPUÉS del loader (en callback `onComplete`)
- Siempre usar `invalidateOnRefresh: true` en ScrollTriggers con valores dinámicos
- `markers: false` en producción (solo true para debug)
- Lenis stop/start en modales para evitar scroll trapped
- `will-change: transform, opacity` en modales · `will-change: transform` en Spline viewer
- Aislar `backdrop-filter` en su propio elemento con `contain: layout style`
