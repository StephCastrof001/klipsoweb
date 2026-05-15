# EVALUATIONS.md — Portfolios y conceptos evaluados

Evaluaciones contra los 7 criterios del sistema de modelos klipso_web.

**Criterios (con peso):**
| Dimensión | Peso |
|---|---|
| Impacto visual | ×2 |
| Adecuación al rol | ×2 |
| Diferencial | ×1.5 |
| UX / Navegabilidad | ×1.5 |
| Performance | ×1 |
| Mobile | ×1 |
| Implementación | ×1 |

**Score ponderado máximo:** 10 puntos × suma de pesos = 100 (normalizado a /10)

---

## 1. elenacalvillo.com

**URL:** https://elenacalvillo.com/
**Stack:** Framer (estimado) — contenido estático, minimal JS
**Rol:** AI Product Manager
**Screenshoteada:** 2026-05-15

### Screenshots
![Hero](../vanilla/web/assets/vendors/elena-hero.png) ← referencia visual (no commiteada)

### Evaluación

| Dimensión | Score | Evidencia |
|---|---|---|
| Impacto visual ×2 | 6 | Clean pero no memorable. Blanco + coral, foto real. Sin animaciones, sin WebGL, sin cursor custom. Podría ser una plantilla Framer. |
| Adecuación al rol ×2 | **10** | "AI Product Manager." es el claim más claro posible. RAG flow real, Build Stack, AI Agent propio. Posicionamiento perfecto. |
| Diferencial ×1.5 | **9** | "The Agentic Proof of Work" + diagrama RAG real + Product Roadmap como artefacto visual. Ningún otro PM hace esto. |
| UX / Navegabilidad ×1.5 | 8 | Scroll vertical limpio, secciones bien jerarquizadas, fácil de escanear. Sin navbar sticky visible pero el flujo es intuitivo. |
| Performance ×1 | 9 | Estático, minimal JS, carga rápida. Sin WebGL ni libs pesadas. |
| Mobile ×1 | 7 | Responsive, foto se adapta bien, tipografía escala correctamente. |
| Implementación ×1 | **10** | Vivo, completo, contenido real con artefactos de trabajo reales. |

**Score ponderado:** (6×2 + 10×2 + 9×1.5 + 8×1.5 + 9×1 + 7×1 + 10×1) / 10 = **8.4 / 10**

### Fortalezas
1. **Contenido como diferencial** — muestra artefactos reales: RAG flow en producción, roadmap, build stack, evolution timeline. No describe su trabajo, lo *demuestra*.
2. **Posicionamiento laser** — "AI Product Manager" + foto + 3 productos activos en 2 líneas. Sin ambigüedad.
3. **"Agentic Proof of Work"** — framing narrativo brillante. Prueba concreta antes de que te pregunten "¿y tú usas AI de verdad?".

### Gaps
1. **Impacto visual bajo** — sin animaciones, sin scroll reveals, sin cursor, sin WebGL. Un diseñador web junior podría replicarlo en Framer en un día.
2. **Sin elemento firma técnico** — el diseño es genérico aunque el contenido es único.
3. **No hay navegación visible** — no hay navbar que permita saltar secciones.

### Lecciones para klipso_web
- **Elena gana en contenido, nosotros ganamos en técnica.** El portfolio ideal es: narrativa de Elena + efectos visuales de M1.
- **Prioridad #1 real**: rellenar `portfolio.js` con proyectos, métricas y narrativa reales. Un M1 con Vanta NET y contenido placeholder es un 6. M1 con contenido real de nivel Elena es un 9.
- **"Proof of Work" como sección**: agregar una sección que muestre artefactos reales del trabajo (no solo el título del proyecto). Para nuestro caso: screenshots de CLI, interceptación de tráfico, flujo n8n.
- **Foto real en el hero**: Elena con foto → inmediatamente más humana y memorable que cualquier WebGL effect.

---

## 2. Conceptos investigados — GitHub

Evaluados en sesión 2026-05-15 contra el perfil: PM técnico + AI builder + RE background + LatAm.

### Terminal / CLI aesthetic

| Repo | Stars | Stack | Técnica clave | Score diferencial |
|---|---|---|---|---|
| satnaing/terminal-portfolio | ⭐367 | React + TS | Fake shell — escribes `about`, `projects`, responde | 8/10 |
| TechSpiritSS/Terminal-Portfolio | ⭐74 | **Vanilla HTML/CSS/JS** | Auto-typewriter en load, sin interacción requerida | 7/10 |
| m4tt72/terminal | — | Svelte | Shell completa con temas y history | 7/10 |
| jcubic/jquery.terminal | ⭐3k | Vanilla JS lib | Terminal real en browser, base de muchos portfolios | — (librería) |

**Autenticidad para nuestro perfil:** 🔥🔥🔥 — Tenemos 3 CLIs reales (BBVA, PlazaVea, Interbank). El portfolio como CLI es narrativamente perfecto.
**Compatible con stack actual:** ✅ Vanilla JS, sin build step.

### Glitch / RE identity

| Repo | Stack | Técnica clave | Score diferencial |
|---|---|---|---|
| SARSHIJ cyberpunk | Tailwind + **GSAP** | `clip-path` strips + `text-shadow` chromatic aberration + scanlines | 9/10 |
| IlyaAgarishev/hacker-portfolio | **Vanilla JS** | Typing-reactive — lo que escribes activa el portfolio | 8/10 |
| Three.js glitch shader | Three.js | Post-processing WebGL oficial | 9/10 |

**Autenticidad para nuestro perfil:** 🔥🔥 — Hacemos RE de Akamai/APIs bancarias. Coherente con el trabajo real.
**Compatible con stack actual:** ✅ GSAP ya cargado, clip-path ya en COMBINATIONS.md §3.

### AI Chat / RAG

| Repo | Stack | Técnica clave | Score diferencial |
|---|---|---|---|
| JeffreytheCoder/chat-portfolio | Next.js | UI = chat puro, rule-based, no LLM | 7/10 |
| medevs/smart-portfolio | Next.js + LangChain + pgvector | RAG sobre CV propio — respuestas grounded | **10/10** |
| kamaalsultan/chat-with-me | Next.js + ChatGPT API | Demo live funcional → sayme.vercel.app | 8/10 |

**Autenticidad para nuestro perfil:** 🔥🔥🔥 — Construimos bots (Vesalio), conocemos LangChain. Seríamos el caso de uso.
**Compatible con stack actual:** ❌ Requiere Next.js + backend. Proyecto separado.

### Data PM

**Patrón dominante:** stat card + número grande + screenshot Amplitude/Mixpanel al inicio de cada caso.
No hay un repo viral — es un patrón de *contenido*, no de código.
**Autenticidad para nuestro perfil:** 🔥 — Todos los PMs lo hacen. Bajo diferencial.

---

## Tabla comparativa final — todos los conceptos

| Concepto | Autenticidad | WOW visual | Dificultad | Stack | Score total |
|---|---|---|---|---|---|
| **AI Chat RAG** | 🔥🔥🔥 | 🔥🔥🔥 | Alta | Next.js (nuevo) | **9.5** |
| **Terminal CLI** | 🔥🔥🔥 | 🔥🔥 | Media | Vanilla ✅ | **8.5** |
| **Glitch / RE** | 🔥🔥 | 🔥🔥🔥 | Media | GSAP ✅ | **8.0** |
| elena style (contenido) | 🔥🔥🔥 | 🔥 | Baja | Cualquiera | **8.4** |
| Data PM | 🔥 | 🔥 | Baja-Media | Cualquiera | **6.0** |
| M1 actual (solo diseño) | — | 🔥🔥 | Completado | Vanilla ✅ | **7.2** |

---

## Decisión arquitectural pendiente

> ¿Este portfolio es un sitio vanilla con efectos o una app Next.js con backend RAG?

- **Ruta A (vanilla + Terminal/Glitch):** implementable en días, diferencial visual, auténtico con el perfil RE/CLI.
- **Ruta B (Next.js + RAG):** el mayor diferencial posible para un PM AI builder, pero 2-3 semanas de proyecto separado.

Las rutas no son excluyentes: vanilla para el portfolio público ahora, RAG como proyecto propio que SE INCLUYE como caso de estudio dentro del portfolio.
