# COMBINATIONS.md — CSS + GSAP Reference

Guía de referencia para el framework klipso_web vanilla.
Leer antes de implementar cualquier animación nueva.

> Sistema de modelos → ver `MODELS.md`

---

## 0. UX Fixes aplicados — M1 (Ronda 1)

Patrones implementados en `framework.js` + `index.html` para pasar de 5/10 → 8/10 UX.

### Scroll-aware navbar
```javascript
// framework.js — dentro de initAnimations(), después del nav slide-in
ScrollTrigger.create({
  start: 100,
  onEnter:     () => gsap.to('#nav', { backgroundColor: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', duration: 0.4 }),
  onLeaveBack: () => gsap.to('#nav', { backgroundColor: 'transparent', backdropFilter: 'none', duration: 0.3 }),
});
```
**Por qué:** `transition` CSS en `.nav` + GSAP maneja el trigger. Alternativa pura CSS con `@keyframes` no puede reaccionar a posición exacta de scroll.

---

### Panel dots indicator (horizontal scroll)
```css
/* index.html CSS */
#featuresContainer { position: relative; }
.features__dots { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); display:flex; gap:10px; z-index:10; pointer-events:none; }
.features__dot  { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.18); transition:background .3s, transform .3s; }
.features__dot.active { background:var(--accent); transform:scale(1.5); }
```
```html
<!-- index.html — dentro de #featuresContainer, antes del track -->
<div class="features__dots" aria-hidden="true">
  <div class="features__dot active"></div>
  <div class="features__dot"></div>
  <div class="features__dot"></div>
</div>
```
```javascript
// framework.js — dentro del bloque horizontal scroll
const dotsEl = document.querySelectorAll('.features__dot');
if (dotsEl.length) {
  ScrollTrigger.create({
    trigger: featContainer, start: 'top top', end: () => '+=' + totalSlide, scrub: true,
    onUpdate: (self) => {
      const active = Math.round(self.progress * (panels.length - 1));
      dotsEl.forEach((d, i) => d.classList.toggle('active', i === active));
    }
  });
}
```
**Por qué:** `scrub:true` (sin número) en el segundo ScrollTrigger es más preciso que el `scrub:1.2` del scroll principal — responde instantáneamente al progress sin lag visual.

---

### Scroll hint animado
```javascript
// framework.js — debajo del parallax badge
gsap.to('.hero__scroll-hint', { y: 7, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });
```
```css
/* index.html — cambiar color de var(--muted) a visible */
.hero__scroll-hint { color: rgba(255,255,255,.5); }
```
**Por qué:** `sine.inOut` + `yoyo` = movimiento orgánico. `delay:2` → espera que el loader termine antes de arrancar.

---

### Card hover accent
```css
/* index.html CSS — agrega la línea lime superior */
.card:hover { background: var(--mid); box-shadow: inset 0 2px 0 var(--accent); }
```
**Por qué:** `box-shadow` inset no afecta el layout (a diferencia de `border-top` que suma al box model y desplaza el grid).

---

### Bigtext reveal fix
```javascript
// framework.js — toggleActions corregido
scrollTrigger: { trigger: line, start: 'top 88%', toggleActions: 'play none none none' }
// Antes: 'play none none reverse' → causaba que el texto se ocultara al scrollear hacia arriba
// 'top 88%': dispara más temprano (antes era 82%) para evitar que se vea cortado
```

---

## 1. Regla fundamental: CSS vs GSAP

| Usa CSS cuando | Usa GSAP cuando |
|---|---|
| La animación es solo visual y no necesita control JS | Necesitas secuenciar, pausar o revertir la animación |
| `transition` en hover simple | La duración depende de scroll (`scrub`) |
| `@keyframes` infinito sin interacción | Necesitas `stagger` entre múltiples elementos |
| `prefers-reduced-motion` debe apagarlo | El valor viene de JS (posición cursor, scroll position) |
| Performance en compositor layer ya está | Necesitas timeline con callbacks (`onComplete`) |

---

## 2. Combinaciones probadas en este proyecto

### clip-path + GSAP (card reveals)
```css
/* CSS define la geometría — GSAP interpola el string */
.card { clip-path: inset(0 0 100% 0); } /* estado inicial */
```
```js
gsap.to('.card', { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.out' });
```
**Por qué funciona:** GSAP detecta el tipo `clip-path` y crea un interpolador de strings.
No usar `clipPath` con `%` mixto con `px` — GSAP no puede interpolar unidades distintas.

---

### will-change + GSAP (GPU compositor hint)
```css
/* Declarar ANTES de que empiece la animación */
.modal        { will-change: transform, opacity; }
.hero__spline { will-change: transform; }
```
```js
/* GSAP setea will-change automáticamente en elementos animados */
/* Solo declararlo en CSS cuando el elemento va a animarse desde el inicio */
```
**Regla:** `will-change` en CSS solo para elementos que SIEMPRE se animan (modal, cursor).
Para reveals on-scroll, no declarar en CSS — GSAP lo maneja solo.

---

### backdrop-filter isolation + modal glassmorphism
```css
/* Aislar el blur en su propio elemento — evita que afecte otros layers */
.modal-overlay {
  contain: layout style;          /* crea nuevo stacking context */
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
}
```
**Por qué:** `backdrop-filter` sin `contain` puede causar repaints en toda la página.
El `contain: layout style` limita el scope del blur.

---

### @property + GSAP (CSS custom properties animables)
```css
/* Sin @property, GSAP no puede interpolar custom properties numéricamente */
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}
.element { opacity: var(--progress); }
```
```js
gsap.to(el, { '--progress': 1, duration: 1 }); /* GSAP anima la custom property */
```
**Cuándo usarlo:** cuando el mismo valor numérico alimenta múltiples propiedades CSS
(ej: `--progress` controla opacity Y scale vía `calc()`).

---

### prefers-reduced-motion: CSS + GSAP coordinados
```css
/* CSS apaga animaciones decorativas */
@media (prefers-reduced-motion: reduce) {
  .grain { animation: none; }
}
```
```js
/* GSAP respeta la preferencia del sistema */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.defaults({ duration: 0.001 });
  gsap.globalTimeline.timeScale(20);
}
```
**Regla:** CSS maneja las animaciones declarativas (grain, marquee CSS).
GSAP maneja las imperativas (ScrollTrigger, timelines). Ambos deben respetarla.

---

### Lenis + ScrollTrigger (integración obligatoria)
```js
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);          /* sync Lenis → ScrollTrigger */
gsap.ticker.add((time) => lenis.raf(time * 1000)); /* sync GSAP ticker → Lenis */
gsap.ticker.lagSmoothing(0);                       /* sin lag smoothing — Lenis ya lo maneja */
/* NO usar scrollerProxy — obsoleto en Lenis v1+ */
```

---

### @layer + GSAP (especificidad CSS)
```css
/* GSAP inyecta estilos inline — tienen mayor especificidad que cualquier clase */
/* Usar @layer para que los estilos base no interfieran */
@layer base { .card { opacity: 1; } }           /* baja especificidad */
/* GSAP: card.style.opacity = '0' → gana siempre */
```
**Regla:** nunca usar `!important` en propiedades que GSAP vaya a animar.
`@layer base` + estilos inline de GSAP = sin conflictos.

---

## 3. Técnicas avanzadas (extraídas de repos benchmark)

### gsap.quickTo() — cursor de alta performance
*Fuente: Thakuma07/Truus.co-Awwward-Website*
```js
/* Mejor que el lerp manual para cursores — setter precompilado */
const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });

window.addEventListener('mousemove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
/* vs nuestro enfoque actual: rAF loop manual con lerp */
/* quickTo es 2-3x más eficiente en renders frecuentes */
```

---

### Image cycling on scroll — alternativa a Spline/Vanta
*Fuente: prashantkoirala465/web-development-portfolio — js/hero.js (código real)*
```js
/* Cycling automático cada 250ms */
const heroImg = document.querySelector('.hero-img img');
let currentImageIndex = 1;
const totalImages = 10;

setInterval(() => {
  currentImageIndex = currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
  heroImg.src = `/images/work-item-${currentImageIndex}.jpg`;
}, 250);

/* PLUS: scale + rotation basados en scroll progress */
ScrollTrigger.create({
  trigger: '.hero-img-holder',
  start: 'top bottom',
  end: 'top top',
  onUpdate: (self) => {
    const p = self.progress; /* 0 → 1 */
    gsap.set('.hero-img', {
      y:        `${-110 + 110 * p}%`, /* entra desde abajo */
      scale:    0.25 + 0.75 * p,     /* escala de 25% a 100% */
      rotation: -15 + 15 * p         /* rota de -15deg a 0 */
    });
  }
});
```
**Patrón clave:** `0.25 + 0.75 * progress` — interpolación lineal entre dos valores.
Funciona para cualquier propiedad: `opacity: 0 + 1 * p`, `blur: 10 - 10 * p`, etc.

---

### Lenis responsive — mobile vs desktop
*Fuente: prashantkoirala465/web-development-portfolio — js/lenis-scroll.js (código real)*
```js
let isMobile = window.innerWidth <= 900;
const lenisConfig = (mobile) => ({
  lerp:         mobile ? 0.05 : 0.1,
  smoothTouch:  mobile,
  touchMultiplier: mobile ? 1.5 : 2,
  smoothWheel:  true,
  syncTouch:    true,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) /* exponential */
});

let lenis = new Lenis(lenisConfig(isMobile));
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = window.innerWidth <= 900;
  if (wasMobile !== isMobile) {
    lenis.destroy();              /* ← importante: destruir antes de recrear */
    lenis = new Lenis(lenisConfig(isMobile));
    lenis.on('scroll', ScrollTrigger.update);
  }
});
```
**Diferencia con nuestro setup actual:** usamos `lerp: 0.1` fijo. Este patrón ajusta
a `lerp: 0.05` en mobile (scroll más suave para touch) y destruye/recrea Lenis en resize.

---

### Card pinning stacked reveals — más dramático que batch
*Fuente: prashantkoirala465/web-development-portfolio*
```js
/* Cards que se apilan — una nueva aparece SOBRE la anterior mientras scrolleas */
gsap.utils.toArray('.card').forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top ' + (80 - i * 5) + '%',   /* cada card entra más tarde */
    pin: true,
    pinSpacing: false,
    end: () => '+=' + window.innerHeight
  });
});
```

---

### Constraint-aware marquee — sin duplicados en el loop
*Fuente: Thakuma07/Truus.co-Awwward-Website*
```js
/* El marquee actual duplica el track y puede tener el mismo item adyacente */
/* Versión mejorada: shuffle garantiza que no hay duplicados en la costura */
function shuffleNoAdjacent(arr) {
  let shuffled;
  do {
    shuffled = [...arr].sort(() => Math.random() - 0.5);
  } while (shuffled.some((el, i) => el === shuffled[(i + 1) % shuffled.length]));
  return shuffled;
}
```

---

### Horizontal scroll — optimizaciones de performance
```js
/* invalidateOnRefresh: true → recalcula en resize */
/* scrub: 1.2 → lag suave, no brusco */
/* anticipatePin: 1 → evita el "flash" al hacer pin */
ScrollTrigger.create({
  trigger: featContainer,
  pin: true,
  start: 'top top',
  anticipatePin: 1,            /* ← agregar esto */
  invalidateOnRefresh: true,
  scrub: 1.2
});
```

---

## 4. Sistema heroEffect — implementación pendiente

El hero tiene 5 modos configurables desde `portfolio.js`:

```js
// portfolio.js meta{}
heroEffect: 'spline'      // Spline 3D viewer (actual)
heroEffect: 'vanta-net'   // Red animada WebGL — vendors/vanta.net.min.js
heroEffect: 'vanta-rings' // Anillos concéntricos — vendors/vanta.rings.min.js
heroEffect: 'vanta-fog'   // Niebla volumétrica — vendors/vanta.fog.min.js
heroEffect: 'gradient'    // Solo CSS radial-gradient, cero JS extra
```

**Config Vanta recomendada para nuestro design system:**
```js
VANTA.NET({
  el: '.hero__spline',
  color: 0xc8ff00,         /* var(--accent) */
  backgroundColor: 0x060606, /* var(--bg) */
  points: 8,
  maxDistance: 20,
  spacing: 18,
  mouseControls: true,
  touchControls: false
})
```

---

## 5. Cuándo NO usar GSAP

- Hover simple sin JS → `transition: color 0.2s` en CSS
- Fade in/out sin scroll trigger → `@keyframes` + `animation`
- Spinner de loading → CSS `animation: spin 1s linear infinite`
- Transformaciones que no necesitan control → CSS `transform` + `transition`

GSAP tiene overhead de inicialización. Para efectos puramente decorativos sin interacción,
CSS puro es siempre más ligero.

---

## 5b. Técnicas Zentry (adrianhajdin/award-winning-website — Awwwards SOTM)

### polygon() clip-path morph en scroll — transición geométrica
*La técnica más característica de Zentry. Nosotros solo usamos `inset()` (rectangular).*
```js
/* El video hero empieza con forma de trapecio irregular */
gsap.set('#video-frame', {
  clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
  borderRadius: '0% 0% 40% 10%',
});
/* Al scrollear se expande a rectángulo completo */
gsap.from('#video-frame', {
  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  borderRadius: '0% 0% 0% 0%',
  ease: 'power1.inOut',
  scrollTrigger: {
    trigger: '#video-frame',
    start: 'center center',
    end: 'bottom center',
    scrub: true,
  },
});
```
**Diferencia clave vs nuestro `inset()`:**
- `inset()` → reveal desde un borde (top, bottom, left, right)
- `polygon()` → morph entre cualquier forma — diamante, trapecio, flecha, orgánico
- Ambos son strings que GSAP interpola — misma técnica, más poder con polygon

---

### Clip-path expand fullscreen — reveal cinematográfico
*Elemento pequeño y redondeado que explota a pantalla completa en scroll.*
```js
const clipAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: '#clip',
    start: 'center center',
    end: '+=800 center',
    scrub: 0.5,
    pin: true,
    pinSpacing: true,
  },
});
clipAnimation.to('.mask-clip-path', {
  width: '100vw',
  height: '100vh',
  borderRadius: 0,
});
```
```css
.mask-clip-path {
  width: 200px;
  height: 200px;
  border-radius: 50%;    /* empieza como círculo */
  overflow: hidden;
  /* GSAP lo expande a 100vw × 100vh con borderRadius:0 */
}
```
**Por qué funciona:** anima `width` + `height` + `borderRadius` simultáneamente.
Diferente a clip-path — el elemento CRECE físicamente, no se recorta.
Ideal para una sección que "revela" el contenido debajo como una apertura de iris.

---

### 3D tilt card — perspectiva en mousemove
*BentoTilt de Zentry — sin GSAP, puro CSS transform calculado en JS.*
```js
function initTiltCards(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width  - 0.5; /* -0.5 → +0.5 */
      const relY = (e.clientY - r.top)  / r.height - 0.5;
      const tiltX = relY * -20;  /* positivo = inclina hacia arriba */
      const tiltY = relX *  20;  /* positivo = inclina hacia la derecha */
      el.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95,.95,.95)`;
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
    });
  });
}
/* Llamar: initTiltCards('.card') */
```
**Diferencia vs nuestro magnetic:** magnetic desplaza X/Y. Tilt rota en 3D — efecto de profundidad.

---

### Radial gradient cursor tracker — glow interno en cards
*Cursor que crea un "spotlight" dentro de la card al hacer hover.*
```js
document.querySelectorAll('.card').forEach(card => {
  const btn = card.querySelector('.card__cta');
  card.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    btn.style.background = `radial-gradient(100px circle at ${x}px ${y}px, rgba(101,111,226,0.53), rgba(0,0,0,0.15))`;
  });
  card.addEventListener('mouseleave', () => {
    btn.style.background = '';
  });
});
/* Adaptar con --accent: rgba(200,255,0,0.3) en lugar del purple de Zentry */
```

---

### Dual video swap — transición cinematográfica entre videos
```js
/* nextVideo escala de 0 a fullscreen, currentVideo encoge a 0 */
gsap.to('#next-video', {
  transformOrigin: 'center center',
  scale: 1, width: '100%', height: '100%',
  duration: 1, ease: 'power1.inOut',
  onStart: () => nextVideoEl.play(),
});
gsap.from('#current-video', {
  transformOrigin: 'center center',
  scale: 0,
  duration: 1.5, ease: 'power1.inOut',
});
```
**Cuándo usarlo:** hero con múltiples videos que transicionan al hacer click/scroll.
Los dos videos están en el DOM simultáneamente — uno encoge mientras el otro crece.

---

## 6. Repos benchmark de referencia

| Repo | Stack | Técnicas clave | En benchmark/ |
|---|---|---|---|
| **adrianhajdin/award-winning-website** | **React+GSAP+Tailwind** | polygon clip-path morph, dual video swap, 3D tilt, radial gradient cursor, clip expand fullscreen | No — extraído aquí |
| Truus.co (Thakuma07) | React+Next+GSAP+Lenis | quickTo cursor, proximity push, stacked cards | No (React) |
| prashantkoirala465 | **Vanilla+GSAP+Lenis+Vite** | image cycling, card pinning, self.progress math | `prashantkoirala-portfolio/` |
| CRUE-CREATIVE (Chanirulk) | React+GSAP+Locomotive | fuentes editoriales, font presets → tokens.css | `crue-creative/` |
| vanta | WebGL backgrounds | 14 efectos animados para hero | `vanta/` dist en vendors/ |
| lottie-web | JSON animation player | Animaciones editables en After Effects | `lottie-web/` player en vendors/ |
| **robin-dela/hover-effect** | **Three.js WebGL** | Distorsión WebGL entre 2 imágenes en hover — nivel Awwwards | `hover-effect/` dist en vendors/ |
| bedimcode/responsive-sidebar-submenu | Vanilla CSS/JS | Hamburger → sidebar slide + active states | `responsive-sidebar-submenu/` ref |
| priontoabdullah/CSS-NavBar-Effect | CSS puro | Amazing-NavBar, water-effect, creative, typing | `css-navbar-effect/` ref |

---

## 7. Navegación — Patrones UX nivel Awwwards

### Scroll-aware navbar (transparent → solid)
```javascript
ScrollTrigger.create({
  start: 80,                             // px desde top
  onEnter:  () => gsap.to('.nav', { backgroundColor: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', duration: 0.4 }),
  onLeaveBack: () => gsap.to('.nav', { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', duration: 0.3 }),
});
```
**Cuándo:** siempre en landing/portfolio. Sin esto el usuario pierde contexto al scrollear.

---

### Hamburger → fullscreen overlay (GSAP — no CSS sidebar)
```html
<button class="nav__hamburger" id="navHamburger" aria-label="Menú">
  <span></span><span></span>
</button>
<div class="nav__overlay" id="navOverlay">
  <nav class="nav__overlay-links">
    <a href="#work">Work</a>
    <a href="#contact">Contact</a>
  </nav>
</div>
```
```css
.nav__overlay { position:fixed; inset:0; background:#080808; z-index:200; display:flex; align-items:center; justify-content:center; clip-path:circle(0% at calc(100% - 48px) 40px); }
.nav__overlay-links a { font-size:clamp(40px,8vw,100px); font-weight:800; display:block; clip-path:inset(0 0 100% 0); }
```
```javascript
const overlayOpen = gsap.timeline({ paused: true })
  .to('#navOverlay',      { clipPath: 'circle(150% at calc(100% - 48px) 40px)', duration: 0.7, ease: 'power3.inOut' })
  .to('.nav__overlay-links a', { clipPath: 'inset(0 0 0% 0)', stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3');

document.getElementById('navHamburger').addEventListener('click', () => {
  const isOpen = overlayOpen.progress() > 0;
  isOpen ? overlayOpen.reverse() : overlayOpen.play();
});
```
**Por qué clip-path circle:** el reveal en círculo desde el botón hamburger es el patrón más reconocido en Awwwards. Alternativa: `scaleY(0 → 1)` desde top.

---

### Panel dots indicator (horizontal scroll)
```javascript
const panels = document.querySelectorAll('.panel');
const dots   = document.querySelectorAll('.features__dot');

ScrollTrigger.create({
  trigger: '#featuresContainer',
  start: 'top top',
  end: () => '+=' + (panels.length - 1) * window.innerWidth,
  scrub: true,
  onUpdate: (self) => {
    const active = Math.round(self.progress * (panels.length - 1));
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }
});
```
```css
.features__dots { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); display:flex; gap:8px; }
.features__dot  { width:6px; height:6px; border-radius:50%; background:var(--muted); transition:background .25s, transform .25s; }
.features__dot.active { background:var(--accent); transform:scale(1.4); }
```

---

### WebGL distorsión en hover de imágenes (robin-dela/hover-effect)
```html
<!-- Requiere Three.js ya cargado (lo tenemos cuando heroEffect es vanta-*) -->
<script src="assets/vendors/hover-effect.umd.js"></script>

<!-- Estructura HTML necesaria: contenedor con 2 imgs -->
<div class="card__img-wrap" data-displacement="assets/img/displacement.jpg">
  <img src="proyecto-a.jpg" alt="estado normal">
  <img src="proyecto-b.jpg" alt="estado hover">
</div>
```
```javascript
document.querySelectorAll('.card__img-wrap').forEach(el => {
  const [img1, img2] = el.querySelectorAll('img');
  new hoverEffect({
    parent:           el,
    image1:           img1.src,
    image2:           img2.src,
    displacementImage: el.dataset.displacement,
    intensity:        0.3,     // 0.1 (sutil) → 1.0 (extremo)
    speedIn:          1.2,
    speedOut:         0.8,
    easing:           'power2.easeOut'
  });
});
```
**Cuándo:** cards de proyectos con 2 estados visuales (thumbnail normal + detalle).
**Requiere:** imagen de displacement (mapa de distorsión — incluir en `assets/img/`).
**Dependency chain:** `three.min.js` → `hover-effect.umd.js` → init (igual que Vanta).
| ogl | WebGL minimal shaders | Custom shaders, 12KB compiled | `ogl/` solo referencia |
