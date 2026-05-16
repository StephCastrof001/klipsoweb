# RAG Local Model — Arquitectura empírica $0

> Versión grounded: usa exactamente lo que ya tenemos corriendo.
> Sin OpenAI. Sin n8n. Sin costos extra.

---

## Stack real (lo que ya existe vs lo que hay que instalar)

```
YA EXISTE                          INSTALAR
─────────────────────────────────────────────────────
EC2 107.21.24.49          ✅       Flowise (Docker)       🔲
Ollama + qwen3-14b        ✅       nomic-embed-text       🔲
Neon pgvector (free)      ✅       pgvector extension     🔲
klipso_web M1 vanilla     ✅       Chat widget en index   🔲
nginx en EC2              ✅       —
```

**Costo total adicional: $0**

---

## Arquitectura completa

```
┌─────────────────────────────────────────────────────────┐
│  BROWSER (vanilla JS — index.html)                       │
│                                                          │
│  [💬 Pregunta] ──fetch POST──▶  EC2:3000/api/v1/         │
│                ◀──JSON resp──   prediction/{flowId}      │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│  EC2 107.21.24.49                                        │
│                                                          │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │  Flowise        │    │  Ollama                  │    │
│  │  (Docker :3000) │───▶│  :11434                  │    │
│  │                 │    │  • nomic-embed-text       │    │
│  │  RAG Chain:     │    │    (embeddings)           │    │
│  │  1. embed query │    │  • qwen3-14b-32k          │    │
│  │  2. vector search│   │    (chat / respuesta)     │    │
│  │  3. build prompt│    └──────────────────────────┘    │
│  │  4. llm call    │                                     │
│  │  5. return resp │    ┌──────────────────────────┐    │
│  └─────────────────┘    │  Neon pgvector (cloud)   │    │
│           │             │  portfolio_embeddings     │    │
│           └────────────▶│  (cosine similarity)     │    │
│                         └──────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de datos — cada pregunta del usuario

```
1. Usuario escribe: "¿Qué proyectos de fintech hiciste?"

2. Vanilla JS:
   fetch('https://107.21.24.49:3000/api/v1/prediction/abc123', {
     method: 'POST',
     body: JSON.stringify({ question: mensaje, history: chatHistory })
   })

3. Flowise recibe → llama Ollama nomic-embed-text:
   "¿Qué proyectos de fintech hiciste?" → vector [0.12, -0.34, 0.87, ...]

4. Flowise → Neon pgvector:
   SELECT content, metadata
   FROM portfolio_embeddings
   ORDER BY embedding <=> '[0.12, -0.34, ...]'
   LIMIT 5

5. Top 5 chunks más similares:
   - chunk: "BBVA CLI — automaticé 23 endpoints bancarios..."
   - chunk: "Interbank — scraping de movimientos vía mobile API..."
   - chunk: "PlazaVea — antigravity, bypass Akamai..."

6. Flowise construye prompt para qwen3-14b:
   "Eres [nombre], PM técnico.
    Contexto: [chunk1] [chunk2] [chunk3] [chunk4] [chunk5]
    Pregunta: ¿Qué proyectos de fintech hiciste?
    Responde en primera persona, solo con info del contexto."

7. qwen3-14b responde → Flowise → vanilla JS → DOM
```

---

## Knowledge Base — qué va al vector DB

### Tabla Neon

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE portfolio_embeddings (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  embedding VECTOR(768),          -- nomic-embed-text = 768 dims
  metadata  JSONB
);

CREATE INDEX ON portfolio_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

> nomic-embed-text usa 768 dims (no 1536 como OpenAI). Actualizar si se cambia de modelo.

### Documentos a ingestar

```
knowledge-base/
  cv.md                    ← experiencia por rol (1 chunk por rol)
  projects/
    bbva-cli.md            ← problema → rol → solución → métricas
    plazavea-cli.md
    interbank-cli.md
    vesalio-bot.md
    rag-portfolio.md       ← este mismo proyecto como caso
  skills.md                ← stack técnico flat
  about.md                 ← bio, rol, filosofía
  contact.md               ← email, LinkedIn, GitHub
```

### Template de proyecto (chunk por sección)

```markdown
# BBVA CLI

## El problema
[Qué no funcionaba — específico]

## Mi rol
[Qué hice YO — no el equipo]

## La solución técnica
[Stack + approach — RE de Akamai, mitmproxy, etc.]

## Resultados
- Endpoints automatizados: 23
- Tiempo de extracción: de 2h manual a 4min
- Estado: en producción

## Stack
Python · mitmproxy · Playwright · Akamai bypass · SQLite
```

---

## Flowise — RAG Chain visual

El chain que construís en Flowise UI (drag & drop):

```
[File Loader / Text Input]
        ↓
[Recursive Character Splitter]
  chunkSize: 500
  chunkOverlap: 100
        ↓
[Ollama Embeddings]
  model: nomic-embed-text
  baseUrl: http://localhost:11434
        ↓
[Neon PGVector Store]
  connectionString: postgresql://...neon.tech/portfolio
  tableName: portfolio_embeddings
```

Para el query chain:

```
[Chat Input]
        ↓
[Ollama Embeddings]  ──▶  [Neon PGVector Retriever]
  model: nomic-embed-text    topK: 5
        ↓
[Conversational Retrieval QA Chain]
  LLM: Ollama qwen3:14b
  systemMessage: "Eres [nombre], PM técnico..."
        ↓
[Chat Output]
```

---

## Chat widget en index.html

```javascript
// Capa 2 add-on — se agrega encima de cualquier modelo M1-M6
const RAG_ENDPOINT = 'https://107.21.24.49:3000/api/v1/prediction/FLOW_ID';
let chatHistory = [];

const chat = async (message) => {
  const res = await fetch(RAG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message, history: chatHistory })
  });
  const data = await res.json();
  chatHistory.push({ role: 'user', content: message });
  chatHistory.push({ role: 'assistant', content: data.text });
  return data.text;
};

// Botón flotante (compatible con M1, M3, M4, M6)
// En M5 Terminal: el comando `ask <pregunta>` llama a chat() directamente
```

---

## Setup — pasos concretos

```bash
# 1. Instalar nomic-embed-text en Ollama (EC2)
ollama pull nomic-embed-text   # 274MB — 5 min

# 2. Instalar Flowise en EC2 (Docker)
docker run -d \
  --name flowise \
  -p 3000:3000 \
  -v ~/.flowise:/root/.flowise \
  flowiseai/flowise
# → UI en http://107.21.24.49:3000

# 3. Crear tabla en Neon
# → Correr el SQL de arriba en Neon console

# 4. Configurar Flowise (UI visual)
# → Crear RAG chain drag & drop (15 min)

# 5. Ingestar knowledge base
# → Subir archivos en Flowise → click "Upsert"

# 6. Copiar FLOW_ID y pegar en el widget vanilla
```

**Tiempo total de setup: ~2-3h**
**Tiempo de escritura de KB (casos de proyecto): 3-4h**

---

## Performance esperada (empírica)

| Métrica | Valor esperado |
|---|---|
| Latencia por respuesta | 3-8s (qwen3-14b en T4) |
| Calidad de respuesta | Alta — 14B params, grounded en KB |
| Costo por query | $0 — todo local |
| Max queries concurrentes | 1 (T4 sin batching) |
| Tamaño KB | ~50 chunks / ~25KB texto |

> Si la latencia es alta: cambiar a qwen35u-tools:9b (~5GB VRAM, 1-3s).
> qwen3-14b da mejor calidad de respuesta; qwen35u-tools:9b da más velocidad.

---

## Comparativa de rutas

| | Flowise (esta ruta) | FastAPI custom | n8n (descartado) |
|---|---|---|---|
| Código a escribir | Mínimo (config UI) | ~150 líneas Python | Workflows visuales |
| Debuggear | Logs en Docker | Logs Python | UI n8n |
| Control | Medio | Máximo | Bajo |
| Ollama support | ✅ nativo | ✅ SDK | ⚠️ plugin |
| Tiempo setup | 2-3h | 4-6h | 2h (pero frágil) |
| Versionado en git | Solo config JSON | ✅ todo código | ⚠️ parcial |

**Recomendación:** Flowise para arrancar rápido. Si necesitás más control en 3 meses → migrar a FastAPI reutilizando el mismo Neon schema.

---

## Este proyecto como caso de estudio (Proyecto 5)

```javascript
// portfolio.js — cuando esté live
{
  id: "005",
  title: "Portfolio RAG Agent",
  label: "AI + PM",
  description: "Chatbot entrenado sobre mi CV. Responde preguntas sobre mi experiencia usando RAG local: Flowise + Ollama qwen3 + pgvector. Costo: $0.",
  tags: ["RAG", "Flowise", "Ollama", "pgvector", "EC2"]
}
```
