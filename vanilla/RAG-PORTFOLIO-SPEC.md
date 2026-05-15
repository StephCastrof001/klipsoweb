# RAG Portfolio Chatbot — Spec

> "El portfolio ES un bot entrenado sobre tu CV"
> Estado: 🔲 Pendiente — proyecto separado del vanilla starter

---

## Por qué este proyecto es el diferencial real

- **Elena Calvillo** muestra artefactos de trabajo → 8.4/10
- **Este proyecto** = eres literalmente un agente conversacional → 10/10 diferencial
- Ningún PM en LatAm tiene esto funcionando en su portfolio
- Coherencia total: buildeas bots para clientes, tu portfolio ES un bot

---

## Stack recomendado — Ruta n8n (más rápida dado tu perfil)

Ya usas n8n. El backend de ingestion y query son dos workflows, no código.

```
Frontend:  Next.js 15 (o vanilla HTML con fetch) → chat widget
Ingestion: n8n workflow (Webhook → Chunk → Embed → pgvector)
Query:     n8n workflow (Webhook → Embed → Vector Search → GPT → Responde)
Vector DB: Neon serverless Postgres + pgvector (free tier)
LLM:       gpt-4o-mini (más barato) o claude-haiku-4-5 (más coherente)
Deploy:    Vercel (frontend) + n8n cloud o self-hosted (ya tienes EC2)
```

**Costo estimado:** ~$0/mes en tráfico de portfolio (Neon free + Vercel free + n8n self-hosted en EC2)

---

## Alternativa — Ruta Python (más control)

Si quieres código propio sin depender de n8n cloud:

```
Backend:   FastAPI + pgvector + OpenAI SDK
Vector DB: Neon serverless Postgres (free tier)
Chunking:  LangChain RecursiveCharacterTextSplitter
Frontend:  Next.js o vanilla fetch
Deploy:    Railway $5/mes o EC2 (ya tienes)
```

---

## Knowledge Base — qué va al vector DB

Cada documento = chunks de 300-500 tokens con metadata.

### Documentos a incluir

| Documento | Formato | Chunks | Metadata |
|---|---|---|---|
| CV / Resume | Markdown | 1 por rol (experiencia) | `category: experience` |
| BBVA CLI — caso | Markdown | 1 por sección (problema/solución/resultado) | `project: bbva-cli` |
| PlazaVea CLI — caso | Markdown | 1 por sección | `project: plazavea` |
| Interbank CLI — caso | Markdown | 1 por sección | `project: interbank` |
| Vesalio Bot — caso | Markdown | 1 por sección + métricas | `project: vesalio` |
| Skills / Stack | Key-value flat | 1 chunk total | `category: skills` |
| Sobre mí / rol | Texto plano | 1 chunk | `category: about` |
| Contacto / LinkedIn | Texto plano | 1 chunk | `category: contact` |

### Template de caso de proyecto (Markdown)

```markdown
# [Nombre del Proyecto]

## El problema
[Qué no funcionaba o qué oportunidad existía]

## Mi rol
[Qué hice específicamente — no el equipo, yo]

## La solución técnica
[Cómo lo resolví — stack, approach]

## Resultados
- Métrica 1: [número concreto]
- Métrica 2: [número concreto]

## Artefactos
[Links, screenshots, repos]

## Stack
[Lista de tecnologías usadas]
```

---

## Arquitectura RAG — cómo funciona

```
1. INGESTION (una vez, o cuando actualizas tu info)
   portfolio.js / markdown docs
        ↓
   Chunking (300-500 tokens, 20% overlap)
        ↓
   OpenAI text-embedding-3-small (1536 dims)
        ↓
   INSERT INTO portfolio_embeddings (content, embedding, metadata)

2. QUERY (cada pregunta del usuario)
   "¿Qué proyectos de fintech has hecho?"
        ↓
   Embed la pregunta → vector de 1536 dims
        ↓
   SELECT content ORDER BY embedding <=> query_vector LIMIT 5
        ↓
   Top 5 chunks más similares como contexto
        ↓
   Prompt: "Eres un asistente de [nombre]. Responde basado en:
            [chunk1] [chunk2] [chunk3] [chunk4] [chunk5]
            Pregunta: ¿Qué proyectos de fintech has hecho?"
        ↓
   gpt-4o-mini → respuesta grounded (no inventa)
```

---

## Sistema prompt — personalidad del bot

```
Eres [Nombre], PM técnico especializado en AI builders y reverse engineering de APIs bancarias en LatAm.

Responde en primera persona como si fueras [Nombre].
Usa solo la información del contexto provisto — si no sabes algo, di "no tengo esa info en mi portfolio".
Sé directo y técnico, como hablaría un PM que también es developer.
Si te preguntan por contacto: [email].
Idioma: español por defecto, inglés si te preguntan en inglés.
```

---

## Implementación n8n — flujos a construir

### Workflow 1: Ingestion
```
Webhook (POST /ingest)
  → Code node: lee documento, chunking manual
  → Loop Over Items
    → HTTP Request: OpenAI embeddings API
    → Neon node: INSERT INTO portfolio_embeddings
  → Respond to Webhook: {status: "ok", chunks_added: N}
```

### Workflow 2: Query (el que responde el chat)
```
Webhook (POST /chat, body: {message, history[]})
  → HTTP Request: OpenAI embeddings (embed el mensaje)
  → Neon node: SELECT ... ORDER BY embedding <=> $1 LIMIT 5
  → Code node: formatea contexto + construye prompt
  → HTTP Request: OpenAI chat completions (gpt-4o-mini)
  → Respond to Webhook: {response: "..."}
```

### Widget en el portfolio (vanilla JS)
```javascript
// En index.html — botón flotante que abre un chat
const chat = async (message) => {
  const res = await fetch('https://tu-n8n.com/webhook/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: chatHistory })
  });
  return (await res.json()).response;
};
```

---

## Este proyecto ES un caso de estudio

Cuando lo termines, va directo a `portfolio.js` como Proyecto 5:

```javascript
{
  id: "005",
  title: "Portfolio RAG Agent",
  label: "AI + PM",
  description: "Chatbot entrenado sobre mi CV y proyectos. Responde preguntas sobre mi experiencia usando RAG con pgvector + gpt-4o-mini.",
  tags: ["RAG", "n8n", "pgvector", "OpenAI"]
}
```

---

## Pasos para arrancar

1. Escribir los casos de proyecto en Markdown (template arriba) — 1-2h
2. Preparar el CV en formato plano — 30min
3. Crear tabla `portfolio_embeddings` en Neon — 15min
4. Construir workflow de ingestion en n8n — 2h
5. Construir workflow de query en n8n — 1h
6. Agregar widget de chat al `index.html` — 1h
7. Testear con 10 preguntas reales — 30min

**Total estimado:** 6-8h en sesiones separadas

---

## Referencias

| Repo | Stack | Lo que tomamos |
|---|---|---|
| medevs/smart-portfolio | Next.js + LangChain + Supabase | Estructura de KB en configs JS |
| cameronobriendev/n8n-rag-chatbot | n8n + Neon + OpenAI | Los dos workflows n8n |
| neon.com/guides RAG portfolio | FastAPI + pgvector | Schema de la tabla + cosine query |
| JeffreytheCoder/chat-portfolio | Next.js rule-based | UI del widget de chat |
