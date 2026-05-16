# RESOURCES.md — Recursos gratuitos para klipso_web

Catálogo de frameworks, agentes, componentes y portfolios PM de referencia.
Cada recurso tiene su propuesta de integración con el stack actual.

---

## Estructura del catálogo

```
Capa 1 — Visual (vanilla, sin backend)
Capa 2 — AI / Chatbot (requiere backend)
Referencia — Estudiar online, no instalar
```

---

## 1. Portfolios PM con AI — referencia directa

| Repo | Stack | Stars | Diferencial | Integración |
|---|---|---|---|---|
| **medevs/smart-portfolio** | Next.js 15 + Supabase pgvector + OpenAI | 43⭐ | RAG sobre CV propio, bento grid, terminal aesthetic | Capa 2 — arquitectura RAG |
| **medevs/local-smart-portfolio** | Next.js + **Ollama** + pgvector | — | Sin OpenAI — usa modelos locales | 🔥 Capa 2 — usa nuestro EC2 Ollama |
| **kamaalsultan/chat-with-me** | Next.js + ChatGPT API | — | Demo live funcional, chat con history | Capa 2 — widget UI |
| **JeffreytheCoder/chat-portfolio** | Next.js | — | UI chat puro, rule-based, sin LLM | Capa 2 — patrón widget simple |

### Por qué local-smart-portfolio es clave

Ya tenemos Ollama corriendo en EC2 (qwen3-14b, qwen35u-tools:9b).
`local-smart-portfolio` usa Ollama como LLM — costo RAG = $0, sin OpenAI API key.

```
vanilla JS → FastAPI EC2 → Ollama (qwen) → Neon pgvector
                     ↑
            mismo EC2 que Aider
```

---

## 2. Frameworks / Starters gratuitos

### Para Capa 2 (si se hace Next.js)

| Repo | Stack | Lo que tomamos |
|---|---|---|
| **techwithanirudh/shadcn-portfolio** | Next.js 15 + shadcn/ui + Framer Motion | Base visual para Capa 2 |
| **magicuidesign/portfolio** | Next.js 14 + Magic UI + Tailwind | Un solo config file — estructura de datos |
| **shadcnspace/typefolio** | Next.js + shadcn/ui + Tailwind | One-page design, layout limpio |

### Para Capa 1 (vanilla, sin build step)

No existe un starter vanilla con la calidad de shadcn. **Nosotros somos ese starter** — klipso_web M1 es el equivalente vanilla.

---

## 3. Agentes y chatbots open-source (self-hosteable)

| Herramienta | Stars | RAG nativo | Ollama | Docker | Propuesta |
|---|---|---|---|---|---|
| **Flowise** | 52.8k⭐ | ✅ LangChain | ✅ | ✅ | Backend RAG visual, sin escribir código |
| **Dify** | 35k+⭐ | ✅ nativo | ✅ | ✅ | App builder completo, más pesado |
| **Botpress** | 14.7k⭐ | ✅ nativo | ⚠️ | ✅ | Chatbot con flows visuales |
| **Chainlit** | — | ✅ LangChain | ✅ | ✅ | UI de chat Python, liviano |
| **n8n** | — | ⚠️ via plugin | ⚠️ | ✅ | Ya conocido — descartado para RAG (ver COMPAT.md) |

### Opción recomendada: Flowise en EC2

```
EC2 (ya tenemos) → Docker → Flowise UI visual
                       ↓
              Construís el RAG flow sin código:
              Upload docs → chunk → embed → pgvector → query → response
                       ↓
              Expone endpoint HTTP → vanilla JS fetch lo consume
```

**Ventaja sobre FastAPI:** sin escribir código backend — flujo visual en Flowise.
**Ventaja sobre n8n:** Flowise está diseñado para RAG/LLM, no para workflows genéricos.
**Costo:** $0 — self-hosted en EC2 que ya pagás.

### Alternativa aún más simple: Chainlit

Si querés escribir código Python en vez de flujos visuales:
```python
# chainlit_app.py — 30 líneas
import chainlit as cl
from langchain.chains import RetrievalQA

@cl.on_message
async def main(message: cl.Message):
    chain = RetrievalQA.from_chain_type(llm=ollama, retriever=pgvector_retriever)
    response = chain.run(message.content)
    await cl.Message(content=response).send()
```

---

## 4. Componentes UI con animaciones (React — solo referencia visual)

No son vanilla-compatibles, pero sus efectos CSS/GSAP son extraíbles.

| Librería | Stars | Vanilla? | Lo que extraemos |
|---|---|---|---|
| **Aceternity UI** | — | ❌ React | Spotlight effect, glitch cards, text reveal — patterns para M6 |
| **Magic UI** | — | ❌ React | Shimmer buttons, border beam, word rotate — patterns para M1 |
| **shadcn/ui** | — | ❌ React | Design tokens, color system, componentes — referencia visual |

### Cómo extraer de Aceternity/Magic UI sin React

```javascript
// Aceternity "spotlight" effect — extractable a vanilla:
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth * 100;
  const y = e.clientY / window.innerHeight * 100;
  el.style.background = `radial-gradient(circle at ${x}% ${y}%, #c8ff0030, transparent 60%)`;
});
```

---

## 5. Portfolios PM — patrones de contenido (no código)

Patrón dominante en los mejores portfolios PM con AI:

```
1. Hero          — claim + rol en 1 línea + foto
2. Proof         — logos de clientes O artefactos reales (diagrama RAG, roadmap)
3. Proyectos     — caso con: problema → rol → solución → métricas
4. Skills/Stack  — no lista, sino contexto ("usé X para resolver Y")
5. Chat/Bot      — diferencial: el portfolio responde preguntas
6. Contacto      — directo, sin formulario innecesario
```

---

## 6. Propuesta de integración con klipso_web

### Lo que se acopla a Capa 1 (vanilla, ya construido)

| Recurso | Cómo | Dificultad |
|---|---|---|
| Aceternity spotlight effect | Vanilla JS mousemove → CSS radial-gradient | Baja |
| Magic UI border beam | CSS @keyframes animation en cards | Baja |
| Sección "Worked with" logos (aucadian pattern) | HTML + CSS grid en index.html | Muy baja |
| Sección "Proof of Work" artefactos | HTML + screenshots reales en index.html | Muy baja |

### Lo que va a Capa 2 (proyecto separado, Next.js o vanilla + backend)

| Recurso | Stack mínimo | Tiempo estimado |
|---|---|---|
| RAG chatbot widget | FastAPI EC2 + Ollama + Neon pgvector | 6-8h |
| Flowise como backend alternativo | Docker en EC2 + Neon | 2-3h setup |
| medevs/local-smart-portfolio | Next.js + Ollama (fork y adaptar) | 1-2 días |

### Combinaciones prohibidas (ver COMPAT.md)

- M5 Terminal + RAG widget flotante → conflicto UI — integrar como comando `ask`
- M2 Spline + Aceternity spotlight → dos GPU WebGL en hero
- M4 Minimal + Aceternity/Magic UI effects → contradice filosofía de M4

---

## Referencias rápidas

| Qué necesito | Dónde buscar |
|---|---|
| Instalar Flowise en EC2 | `docker run -d -p 3000:3000 flowiseai/flowise` |
| Schema pgvector para portfolio | `benchmark/smart-portfolio-rag/` |
| Widget UI de chat | `benchmark/chat-portfolio-widget/components/` |
| Engine de terminal vanilla | `benchmark/terminal-portfolio-vanilla/script.js` |
| Técnicas Glitch/RE | `benchmark/EVALUATIONS.md §2` |
| Compatibilidad de efectos | `benchmark/COMPAT.md` |
