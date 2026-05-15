# klipso_web

Web engagement framework — páginas con elementos de alto impacto que los AI tools no generan.

---

## Antes de empezar: elige tu stack

Responde estas 4 preguntas y el resultado te dice qué carpeta usar.

### Pregunta 1 — ¿Cuántos proyectos vas a mostrar?
- Menos de 15 → **vanilla/**
- Más de 15 → **astro/**

### Pregunta 2 — ¿Necesitas que Google te encuentre (SEO)?
- No importa por ahora → **vanilla/**
- Sí, quiero aparecer en búsquedas → **astro/**

### Pregunta 3 — ¿Cómo prefieres editar el contenido?
- Editando un archivo `.js` → **vanilla/**
- Escribiendo en Markdown (`.mdx`) → **astro/**

### Pregunta 4 — ¿Tienes experiencia con build steps (npm install, npm run dev)?
- No, prefiero abrir el HTML directo → **vanilla/**
- Sí, sin problema → **astro/**

---

## Resultado

| Mayoría de respuestas | Usa esta carpeta |
|---|---|
| vanilla | → `vanilla/` — abre `vanilla/web/index.html` en el browser o `npx serve vanilla/web` |
| astro | → `astro/` — sigue el `astro/README.md` para inicializar |

> **Regla de oro:** Si tienes dudas, empieza con `vanilla/`.
> Cuando el portafolio crezca a +15 proyectos o necesites SEO, migrar a `astro/` toma ~2 horas.
> El `data/portfolio.js` de vanilla se convierte en archivos `.mdx` de Astro casi 1:1.

---

## ¿Qué tiene cada carpeta?

### `vanilla/` — Zero build step
```
vanilla/
├── web/
│   ├── index.html          ← portafolio principal (lee portfolio.js)
│   ├── assets/
│   │   ├── tokens.css      ← design tokens (colores, tipografía)
│   │   ├── modern-css.css  ← features CSS post-2023 (css-bash pattern)
│   │   └── framework.js    ← GSAP + Lenis + cursor + grain (no tocar)
│   ├── data/
│   │   └── portfolio.js    ← TUS proyectos (solo editar esto)
│   └── cases/              ← páginas custom por proyecto
└── README.md
```

### `astro/` — Con build step, SEO, MDX
```
astro/
├── src/
│   ├── layouts/
│   │   └── FrameworkLayout.astro  ← GSAP + Lenis base
│   ├── content/
│   │   └── projects/
│   │       └── ejemplo.mdx        ← un archivo por proyecto
│   └── pages/
│       ├── index.astro            ← portafolio principal
│       └── cases/[slug].astro     ← ruta dinámica por caso
├── package.json
└── README.md
```

---

## Estructura del repo completo

```
klipso_web/
├── vanilla/            ← starter sin build step
├── astro/              ← starter con Astro
├── web/                ← versión de trabajo actual (monolítica)
├── benchmark/          ← referencias e inspiración
├── gsap-skills-ref/    ← skills GSAP (greensock/gsap-skills)
├── ui-ux-pro-max-skill/← skills UX/UI (nextlevelbuilder)
├── CLAUDE.md           ← contexto para Claude Code
└── README.md           ← este archivo
```

---

## Engine compartido (en ambas versiones)

| Componente | Tecnología | Regla |
|---|---|---|
| Animaciones | GSAP 3 (CDN) — ScrollTrigger, SplitText, ScrambleText, DrawSVG | NUNCA modificar |
| Smooth scroll | Lenis v1.1.14 | NUNCA modificar |
| Custom cursor | JS vanilla + GSAP lerp | NUNCA modificar |
| Grain texture | CSS SVG feTurbulence | NUNCA modificar |
| Design tokens | CSS custom properties (3 capas) | Sí editar |
| Datos | portfolio.js (vanilla) / .mdx (astro) | Sí editar |
