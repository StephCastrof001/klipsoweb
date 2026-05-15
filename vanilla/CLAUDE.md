# CLAUDE.md — klipso_web vanilla starter

## Excepción de orquestación aprobada por el usuario

Para este proyecto (vanilla starter template), **Claude puede escribir y editar
archivos JS directamente** sin delegar a Aider.

Razón: los archivos JS aquí son plantillas/boilerplate del framework,
no lógica de aplicación con riesgo de regresión en producción.

Esta excepción aplica SOLO a:
- `web/data/portfolio.js`
- `web/assets/framework.js`
- `web/cases/_template.html`

---

## Archivos que Claude SÍ puede editar directamente

| Archivo | Tipo |
|---|---|
| `web/data/portfolio.js` | Datos — array de proyectos |
| `web/assets/framework.js` | Engine GSAP/Lenis (extraído de web/index.html) |
| `web/assets/tokens.css` | Design tokens |
| `web/assets/modern-css.css` | CSS catalog |
| `web/index.html` | Template HTML |
| `web/cases/*.html` | Casos de estudio |

## Archivos que Claude NO debe modificar

| Archivo | Por qué |
|---|---|
| `../web/index.html` | Versión de producción activa — no tocar |
| `../CLAUDE.md` | Reglas globales del repo |

---

## Reglas del framework (inamovibles)

- GSAP registerPlugin() una sola vez, al inicio de framework.js
- Lenis: `lenis.on('scroll', ScrollTrigger.update)` — NO scrollerProxy
- gsap.ticker.add((time) => lenis.raf(time * 1000)) — patrón obligatorio
- Modal: lenis.stop() al abrir · lenis.start() al cerrar
- prefers-reduced-motion: gsap.defaults({duration:0.001}) + timeScale(20)
- No innerHTML con datos de usuario — solo textContent y appendChild

---

## Stack

- HTML/CSS/JS vanilla — sin build step
- GSAP 3 vía CDN — ScrollTrigger, SplitText, ScrambleText, DrawSVG
- Lenis v1.1.14 vía CDN
- Spline viewer vía CDN module
- ES modules nativos (type="module") para portfolio.js

## Arrancar

```bash
npx serve web
# → http://localhost:3000
```
