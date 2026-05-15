# benchmark/ — Repos de referencia y análisis

> Las subcarpetas `vanta/`, `lottie-web/` y `ogl/` NO están en git (ver `.gitignore`).
> Clonar manualmente con los comandos de abajo cuando las necesites.

```bash
cd klipso_web/benchmark
git clone --depth=1 https://github.com/tengbao/vanta vanta
git clone --depth=1 https://github.com/airbnb/lottie-web lottie-web
git clone --depth=1 https://github.com/oframe/ogl ogl
git clone --depth=1 https://github.com/prashantkoirala465/web-development-portfolio prashantkoirala-portfolio
git clone --depth=1 https://github.com/Chanirulk/Awwwards-remake-CRUE-CREATIVE crue-creative
git clone --depth=1 https://github.com/robin-dela/hover-effect hover-effect
git clone --depth=1 https://github.com/bedimcode/responsive-sidebar-submenu responsive-sidebar-submenu
git clone --depth=1 https://github.com/priontoabdullah/CSS-NavBar-Effect css-navbar-effect

# RAG Portfolio — referencia (NO clonar, estudiar online)
# medevs/smart-portfolio     → Next.js + LangChain + Supabase pgvector
# cameronobriendev/n8n-rag   → n8n + Neon pgvector + OpenAI (ruta recomendada)
# neon.com/guides/rag-portfolio → FastAPI + pgvector (ruta Python)
```

## Qué extraemos de cada repo → `vanilla/web/assets/vendors/`

| Repo | Archivos extraídos | Peso |
|---|---|---|
| vanta | `dist/vanta.net.min.js` · `vanta.rings.min.js` · `vanta.fog.min.js` | ~50KB c/u |
| lottie-web | `build/player/lottie_light.min.js` | ~68KB |
| hover-effect | `dist/hover-effect.umd.js` | 5KB |
| ogl | Solo referencia — estudiar `src/` y `examples/` | — |
| responsive-sidebar-submenu | Solo referencia — patrón hamburger + GSAP | — |
| css-navbar-effect | Solo referencia — Amazing-NavBar, water, creative | — |

## Efectos Vanta disponibles

`waves` · `fog` · `net` · `rings` · `dots` · `birds` · `globe` · `cells` · `clouds` · `trunk` · `topology` · `halo`

## OGL — cuándo usarlo

Cuando necesites un efecto que ningún portfolio tiene: gradiente mesh animado,
distorsión de imagen on scroll, partículas que siguen al cursor en WebGL.
Requiere escribir GLSL. Usar como ES module (`<script type="module">`).

## Por qué no están en git

| Repo | Tamaño |
|---|---|
| vanta | 2.3MB |
| lottie-web | 80MB |
| ogl | 47MB |

---

Carpeta también para referencias de sitios y pivots de ideas.

## Sitios estudiados

| Sitio | Framework | Diferencial |
|---|---|---|
| oryzo.ai | Astro + Three.js r178 (fork Lusion) | Posavasos 3D WebGL, sátira AI hype |
| solais.ai | WordPress + Tailwind v4 + Lenis | Dark luxury SaaS, fonts ki+teknolog |

## Patrones de engagement identificados

- Loading screen inmersivo (bordó #3c091e)
- Custom cursor magnético
- SplitText con mask para reveals
- ScrambleText en hover
- Grain SVG feTurbulence
- Horizontal scroll pinned (GSAP scrub)
- DrawSVG on scroll
- ScrollTrigger.batch para cards
- Elastic spring en botones (magnetic)

## Próximas ideas / pivots

[ ] Three.js canvas con modelo 3D propio
[ ] Lenis + parallax multi-layer
[ ] Variable fonts animadas en scroll
[ ] Page transitions (Barba.js)
[ ] WebGL shader background (simplex noise)
[ ] Infinite gallery con Draggable + InertiaPlugin
