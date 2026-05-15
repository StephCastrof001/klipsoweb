# klipso_web — Vanilla Starter

Zero build step. Abre en el browser, edita un archivo, listo.

## Arrancar

```bash
npx serve web
# → http://localhost:3000
```

O simplemente arrastra `web/index.html` al browser.

## Agregar un proyecto

Edita **solo** `web/data/portfolio.js`:

```js
{
  id: "003",
  title: "Nombre del proyecto",
  label: "Categoría",
  description: "Una oración que describe el resultado.",
  img: "https://tu-imagen.com/screenshot.jpg",
  caseUrl: "./cases/nombre.html",
  tags: ["tag1", "tag2"]
}
```

Guarda el archivo → recarga el browser → aparece automáticamente.

## Agregar un caso de estudio

1. Copia `cases/_template.html` → `cases/nombre-proyecto.html`
2. Edita el contenido (el framework GSAP/Lenis ya está incluido)
3. Apunta `caseUrl` en `portfolio.js` al nuevo archivo

## Archivos que SÍ puedes editar

| Archivo | Qué cambia |
|---|---|
| `data/portfolio.js` | Proyectos, imágenes, textos |
| `assets/tokens.css` | Colores, fuentes del portafolio |
| `cases/*.html` | Contenido de cada caso |

## Archivos que NO debes tocar

| Archivo | Por qué |
|---|---|
| `assets/framework.js` | Motor GSAP + Lenis + cursor + grain — cualquier cambio rompe animaciones |
| `assets/modern-css.css` | Catálogo CSS post-2023 — referencia, no modificar |

## Cuándo migrar a Astro

- Tienes más de 15 proyectos
- Necesitas SEO (Google indexación)
- Quieres escribir casos en Markdown
- → Ver `../astro/README.md`
