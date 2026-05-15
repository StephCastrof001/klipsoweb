# Unit Specs — vanilla/ JS files

Los siguientes archivos deben ser generados por Aider.
Los archivos HTML, CSS y MDX ya están creados.

---

## TASK: portfolio-data-file

GOAL: Crear el archivo de datos del portafolio como ES module exportable

FILES:
  - vanilla/web/data/portfolio.js

CONTRACT:
  export const projects = Array<{
    id: string,
    title: string,
    label: string,
    description: string,
    img: string,
    caseUrl: string,
    tags: string[]
  }>
  export const meta = {
    name: string,
    role: string,
    tagline: string,
    location: string,
    email: string,
    linkedin: string,
    github: string
  }

DONE WHEN:
  - `import { projects, meta } from './data/portfolio.js'` funciona en browser
  - projects.length >= 4 (Vesalio, BBVA, Plaza Vea, Interbank)
  - No hay innerHTML — solo datos primitivos string/array

ROLLBACK: git revert HEAD

---

## TASK: framework-engine-extract

GOAL: Extraer el JS de web/index.html a vanilla/web/assets/framework.js

FILES:
  - web/index.html                   (fuente — leer, no modificar)
  - vanilla/web/assets/framework.js  (destino — crear)

CONTRACT:
  El archivo debe exponer en window: initMagnetic(), openModal(), closeModal()
  Debe inicializar en DOMContentLoaded:
    - gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin)
    - prefers-reduced-motion check
    - Lenis (lerp:0.1) con lenis.on('scroll', ScrollTrigger.update)
    - Custom cursor (dot + ring, rAF loop con lerp)
    - Loader animation (counter 0→100, bar, exit)
    - Nav reveal (translateY(-100% → 0))
    - Hero SplitText reveal
    - ScrollTrigger.batch('.card') con clip-path reveal
    - Modal open/close/trapFocus (lenis.stop/start)

DONE WHEN:
  - vanilla/web/index.html carga sin errores en consola
  - Loader aparece y desaparece
  - Cursor visible y sigue el mouse
  - Cards revelan con clip-path en scroll

ROLLBACK: git revert HEAD
