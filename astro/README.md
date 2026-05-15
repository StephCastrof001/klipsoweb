# klipso_web — Astro Starter

Con build step, SEO automático, contenido en Markdown (MDX).

## Cuándo usar esto vs vanilla

| Necesidad | Usar |
|---|---|
| < 15 proyectos, sin SEO | `../vanilla/` |
| > 15 proyectos, SEO importante | **este starter** |
| Contenido en Markdown | **este starter** |
| Zero build step | `../vanilla/` |

---

## Setup (primera vez)

```bash
cd klipso_web/astro
npm create astro@latest . -- --template minimal
npm install gsap @gsap/scrolltrigger
npm install lenis
npm run dev
# → http://localhost:4321
```

---

## Estructura

```
astro/
├── src/
│   ├── layouts/
│   │   └── FrameworkLayout.astro   ← GSAP + Lenis base (no tocar)
│   ├── content/
│   │   └── projects/
│   │       ├── _schema.ts          ← tipos TypeScript del proyecto
│   │       ├── vesalio.mdx         ← un archivo por proyecto
│   │       └── bbva.mdx
│   ├── pages/
│   │   ├── index.astro             ← portafolio principal
│   │   └── cases/
│   │       └── [slug].astro        ← ruta dinámica (genera 1 página por .mdx)
│   └── styles/
│       ├── tokens.css              ← design tokens
│       └── modern-css.css          ← css-bash catalog
├── public/
│   └── images/                     ← screenshots de proyectos
├── astro.config.mjs
└── package.json
```

---

## Agregar un proyecto

Crea un archivo `src/content/projects/nombre.mdx`:

```mdx
---
id: "005"
title: "Nombre del Proyecto"
label: "Categoría"
description: "Una oración sobre el resultado."
img: "/images/nombre-screenshot.jpg"
tags: ["tag1", "tag2"]
order: 5
---

## El problema

Lorem ipsum...

## La solución

Lorem ipsum...

## Resultados

- Métrica 1
- Métrica 2
```

Astro genera automáticamente la ruta `/cases/nombre` con el layout.

---

## Integrar GSAP con Astro

GSAP necesita acceso al DOM — en Astro, se ejecuta en el cliente con `client:load`:

```astro
<!-- FrameworkLayout.astro -->
<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import Lenis from 'lenis';

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
</script>
```

REGLA: Mantener `lenis.on('scroll', ScrollTrigger.update)` — NO usar scrollerProxy.

---

## Design tokens

Mismos tokens que `../vanilla/web/assets/tokens.css`.
Copia el archivo a `src/styles/tokens.css` e importa en `FrameworkLayout.astro`:

```astro
---
import '../styles/tokens.css';
import '../styles/modern-css.css';
---
```
