export const projects = [
  {
    id: "001",
    title: "Proyecto 1",
    label: "Categoría por definir",
    description: "Descripción por completar.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80",
    caseUrl: "./cases/vesalio.html",
    tags: ["Tag 1", "Tag 2", "Tag 3"]
  },
  {
    id: "002",
    title: "Proyecto 2",
    label: "Categoría por definir",
    description: "Descripción por completar.",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=640&q=80",
    caseUrl: "./cases/bbva.html",
    tags: ["Tag 1", "Tag 2", "Tag 3"]
  },
  {
    id: "003",
    title: "Proyecto 3",
    label: "Categoría por definir",
    description: "Descripción por completar.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=640&q=80",
    caseUrl: "./cases/plazavea.html",
    tags: ["Tag 1", "Tag 2", "Tag 3"]
  },
  {
    id: "004",
    title: "Proyecto 4",
    label: "Categoría por definir",
    description: "Descripción por completar.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=640&q=80",
    caseUrl: "./cases/interbank.html",
    tags: ["Tag 1", "Tag 2", "Tag 3"]
  }
];

// ── MODELO ACTIVO ─────────────────────────────────────────────────────────
// Cambia `model` para rotar entre configuraciones visuales completas.
// Cada modelo define heroEffect + heroTitle + tagline + tipografía en tokens.css
//
// M1 — Vanta NET  : dark tech, red lime, sin fuentes externas
// M2 — Spline 3D  : hero 3D interactivo, misma paleta
// M3 — Fog luxury : heroEffect fog, fuente Playfair editorial
// M4 — Gradient   : minimalista puro, cero WebGL, carga instantánea
// ──────────────────────────────────────────────────────────────────────────

export const meta = {
  model:      "M1",        // identificador del modelo activo

  name: "Tu nombre",
  role: "Product Manager · AI Builder",
  tagline: "Productos que convierten data en decisiones.",
  heroTitle:  "Portfolio.",
  heroEffect: "vanta-net", // 'spline' | 'vanta-net' | 'vanta-rings' | 'vanta-fog' | 'gradient'
  location: "Lima, Perú",
  email: "",
  linkedin: "",
  github: ""
};
