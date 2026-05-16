# COMPAT.md — Matriz de compatibilidad klipso_web

Qué se puede combinar con qué, y por qué algunos pares son incompatibles.

---

## Regla de oro

> Un modelo = una propuesta visual dominante.
> Dos elementos que compiten por el mismo recurso (GPU, interfaz conversacional,
> foco visual) no van en el mismo modelo.

---

## Capa 1 — Modelos visuales (frontend puro, sin backend)

| ID | Nombre | heroEffect | Filosofía |
|---|---|---|---|
| M1 | Dark Tech | `vanta-net` | WebGL discreto, PM técnico, lime accent |
| M2 | Spline 3D | `spline` | Hero 3D interactivo, diseño-forward |
| M3 | Fog Luxury | `vanta-fog` | Editorial premium, roles creative/strategy |
| M4 | Minimal | `gradient` | Cero WebGL, máxima legibilidad, audiencia no técnica |
| M5 | Terminal CLI | `terminal` | Fake shell vanilla JS, auténtico con perfil RE/CLI |
| M6 | Glitch / RE | `glitch` | Clip-path + chromatic aberration + GSAP, identidad hacker |

## Capa 2 — AI layer (add-on opcional, requiere backend)

| Componente | Stack | Se activa en |
|---|---|---|
| RAG chat widget | FastAPI EC2 + OpenAI SDK + Neon pgvector | Cualquier modelo (botón flotante) |
| Terminal con LLM | Mismo backend, interfaz terminal | Solo M5 — reemplaza fake shell |

**Stack RAG elegido (más robusto que n8n):**
```
vanilla JS fetch  →  FastAPI en EC2 (nginx HTTPS)
                           ↓
                  OpenAI SDK: text-embedding-3-small + gpt-4o-mini
                           ↓
                  Neon pgvector (PostgreSQL serverless, free tier)
```
Ventaja: código versionado, API key nunca expuesta al cliente, sin vendor lock-in, debugging con logs normales.

---

## Matriz de compatibilidad

✅ Compatible | ⚠️ Posible con cuidado | ❌ Incompatible

| Efecto / Feature | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|
| RAG chat widget | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Terminal con LLM | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| hover-effect WebGL | ✅ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| Lottie | ✅ | ⚠️ | ✅ | ✅ | ❌ | ✅ |
| Custom cursor magnético | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Horizontal scroll (GSAP pin) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| SplitText reveals | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| ScrambleText hover | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| DrawSVG on scroll | ✅ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| ScrollTrigger.batch cards | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Grain SVG overlay | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Magnetic buttons | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |

---

## Notas por incompatibilidad

### M2 + WebGL adicional ❌
Spline viewer ya usa GPU. Agregar Vanta, hover-effect o Three.js propio genera
contención de contexto WebGL — frame drops en mid-range GPUs y móviles.

### M5 + la mayoría de efectos ❌
El Terminal CLI es una interfaz completa: ocupa viewport, maneja su propio keyboard
input, tiene su propio sistema de "animación" (typewriter). Mezclar con SplitText
reveals, horizontal scroll o custom cursor rompe la coherencia de experiencia.

### M5 + RAG chat widget ⚠️
Técnicamente funciona. Pero el terminal YA ES una interfaz conversacional.
Dos bocas de entrada compiten → el usuario no sabe dónde escribir.
Solución: en M5 el RAG se integra como comando dentro del terminal (`ask <pregunta>`),
no como widget flotante externo.

### M4 + horizontal scroll ❌
La filosofía de M4 es carga instantánea y máxima legibilidad. El horizontal scroll
requiere GSAP ScrollTrigger, aumenta el JS y crea patrones de navegación no estándar
que penalizan la UX en móvil — exactamente lo que M4 evita.

### M4 + ScrambleText ❌
M4 apunta a audiencia no técnica / reclutadores. ScrambleText es un efecto
que comunica "dev/hacker" — contradice el posicionamiento de M4.

### M6 + ScrambleText ✅ natural
Glitch y ScrambleText comparten la misma estética disruptiva. Son el único par
donde ScrambleText refuerza en vez de distorsionar el modelo.

---

## Repos benchmark por capa

### Capa 1 — referencia de técnicas
| Repo local | Qué extraemos | Para |
|---|---|---|
| `terminal-portfolio-vanilla/` | `script.js` — comandos + typewriter engine | M5 |
| `terminal-portfolio-react/` | UX de comandos, lista de `commandsList` | M5 referencia |
| `jquery-terminal/` | `jquery.terminal.min.js` — engine alternativo | M5 engine |
| `hacker-portfolio/` | `hackscript.js` — kernel code aesthetic, typing-reactive logic | M6 referencia |

### Capa 2 — referencia RAG
| Repo local | Qué estudiamos | Para |
|---|---|---|
| `smart-portfolio-rag/` | Arquitectura KB, chunking, schema pgvector | RAG backend |
| `chat-portfolio-widget/` | UI del widget de chat (componentes) | RAG frontend |
| `chat-with-me/` | Integración ChatGPT API, sistema de history | RAG backend |

### Repos de referencia visual (no AI)
| Repo local | Qué extraemos |
|---|---|
| `vanta/` | `vanta.net.min.js`, `vanta.fog.min.js`, `vanta.rings.min.js` |
| `hover-effect/` | `dist/hover-effect.umd.js` |
| `crue-creative/` | Patrones de layout editorial |
| `css-navbar-effect/` | Amazing-NavBar patterns |

---

## Qué NO existe como repo — estudiar online
| Referencia | Por qué |
|---|---|
| SARSHIJ cyberpunk | No tiene repo público — las técnicas (clip-path strips, scanlines) están documentadas en `EVALUATIONS.md` |
| Three.js glitch shader | Es un ejemplo oficial en threejs.org/examples — no clonar, copiar shader GLSL |
| elenacalvillo.com | Stack: Vite + React + Tailwind + shadcn/ui — evaluación en `EVALUATIONS.md` |
