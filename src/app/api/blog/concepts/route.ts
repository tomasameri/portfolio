import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/serverAuth';

/**
 * Extracción automática de "conceptos" de un post para alimentar el grafo neural.
 *
 * Motor principal: Gemini (REST, sin dependencia extra). Se le pasa el vocabulario
 * de conceptos ya existente para que reuse términos equivalentes en vez de crear
 * duplicados (React ≈ ReactJS ≈ React.js) y así el grafo conecta posts de verdad.
 *
 * Si no hay GEMINI_API_KEY (o Gemini falla), cae a una extracción heurística simple
 * basada en frecuencia + el vocabulario existente, para degradar con gracia.
 */

// Modelo rápido y barato; suficiente para clasificación/extracción de términos.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const MAX_CONCEPTS = 8;
// Recortamos el contenido para no gastar tokens de más ni pegarle al límite de request.
const MAX_CONTENT_CHARS = 12000;

interface ConceptsRequestBody {
  title?: string;
  content?: string;
  excerpt?: string;
  existingConcepts?: string[];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Deduplica respetando el vocabulario existente: si un concepto sugerido coincide
 * (normalizado) con uno ya existente, se conserva la forma existente (canónica).
 */
function canonicalize(
  suggested: string[],
  existing: string[]
): string[] {
  const canonicalByNorm = new Map<string, string>();
  existing.forEach((c) => {
    const n = normalize(c);
    if (n && !canonicalByNorm.has(n)) canonicalByNorm.set(n, c);
  });

  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of suggested) {
    const clean = raw.replace(/\s+/g, ' ').trim();
    if (!clean) continue;
    const n = normalize(clean);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(canonicalByNorm.get(n) ?? clean);
    if (out.length >= MAX_CONCEPTS) break;
  }
  return out;
}

// --- Fallback heurístico (sin IA) ---------------------------------------------

// Stopwords ES/EN mínimas para no proponer palabras vacías como conceptos.
const STOPWORDS = new Set(
  (
    'de la que el en y a los las un una por con para su se del al lo como mas ' +
    'pero sus le ya o este si porque esta entre cuando muy sin sobre tambien me ' +
    'hasta hay donde quien desde todo nos durante todos uno les ni contra otros ' +
    'ese eso ante ellos e esto mi antes algunos que unos yo otro otras otra el ' +
    'tanto esa estos mucho quienes nada muchos cual poco ella estar estas algunas ' +
    'algo nosotros the of to and a in is it you that he was for on are with as i ' +
    'his they be at one have this from or had by hot but some what there we can out ' +
    'other were all your when up use word how said an each she which do their time if'
  ).split(/\s+/)
);

function heuristicConcepts(text: string, existing: string[]): string[] {
  // 1) Prioriza conceptos existentes que aparezcan literalmente en el texto.
  const normText = normalize(text);
  const fromExisting = existing.filter((c) => {
    const n = normalize(c);
    return n.length > 2 && normText.includes(n);
  });

  // 2) Completa con las palabras más frecuentes (capitalizadas o largas), sin stopwords.
  const freq = new Map<string, { display: string; count: number }>();
  const words = text.match(/[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-zÁÉÍÓÚáéíóúÑñ0-9.+#-]{2,}/g) || [];
  for (const w of words) {
    const n = normalize(w);
    if (STOPWORDS.has(n) || n.length < 4) continue;
    const entry = freq.get(n);
    if (entry) entry.count++;
    else freq.set(n, { display: w, count: 1 });
  }
  const topWords = [...freq.values()]
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count)
    .map((e) => e.display);

  return canonicalize([...fromExisting, ...topWords], existing);
}

// --- Gemini -------------------------------------------------------------------

async function geminiConcepts(
  apiKey: string,
  title: string,
  content: string,
  existing: string[]
): Promise<string[]> {
  const existingList = existing.length
    ? existing.join(', ')
    : '(todavía no hay conceptos registrados)';

  const prompt = `Eres un editor que mantiene un grafo de conocimiento de un blog técnico.
Extrae entre 3 y ${MAX_CONCEPTS} CONCEPTOS clave del artículo: ideas, tecnologías, técnicas, entidades o temas centrales — NO palabras genéricas ni frases largas.

Reglas:
- Sustantivos o nombres propios cortos (1-3 palabras). En el idioma del artículo.
- REUTILIZA un concepto de esta lista existente cuando sea semánticamente equivalente, escribiéndolo EXACTAMENTE igual: ${existingList}
- Solo crea un concepto nuevo si no existe uno equivalente en la lista.
- Sin duplicados, sin numeración, sin explicaciones.

Título: ${title}

Artículo:
${content}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        // Forzamos JSON estructurado: un array de strings.
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: { type: 'STRING' },
        },
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('Gemini devolvió una respuesta vacía.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Gemini no devolvió JSON válido.');
  }
  if (!Array.isArray(parsed)) throw new Error('Gemini no devolvió un array.');

  return parsed.filter((x): x is string => typeof x === 'string');
}

export async function POST(request: NextRequest) {
  // 🔒 Solo el admin autenticado puede disparar la extracción (consume la API key).
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'No autorizado.' },
      { status: 401 }
    );
  }

  let body: ConceptsRequestBody;
  try {
    body = (await request.json()) as ConceptsRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Body inválido.' },
      { status: 400 }
    );
  }

  const title = (body.title || '').trim();
  const content = (body.content || '').trim();
  const excerpt = (body.excerpt || '').trim();
  const existing = Array.isArray(body.existingConcepts)
    ? body.existingConcepts.filter((c) => typeof c === 'string' && c.trim())
    : [];

  const fullText = [title, excerpt, content].filter(Boolean).join('\n\n');
  if (fullText.length < 20) {
    return NextResponse.json(
      { success: false, error: 'Escribe algo de contenido antes de sugerir conceptos.' },
      { status: 400 }
    );
  }

  const clippedContent = content.slice(0, MAX_CONTENT_CHARS);
  const apiKey = process.env.GEMINI_API_KEY;

  // Sin API key → heurística directa.
  if (!apiKey) {
    const concepts = heuristicConcepts(fullText, existing);
    return NextResponse.json({ success: true, concepts, source: 'heuristic' });
  }

  try {
    const suggested = await geminiConcepts(apiKey, title, clippedContent, existing);
    const concepts = canonicalize(suggested, existing);
    // Si Gemini devolvió vacío por lo que sea, usamos la heurística como red de seguridad.
    if (concepts.length === 0) {
      return NextResponse.json({
        success: true,
        concepts: heuristicConcepts(fullText, existing),
        source: 'heuristic',
      });
    }
    return NextResponse.json({ success: true, concepts, source: 'gemini' });
  } catch (error: any) {
    console.error('[blog/concepts]', error?.message ?? error);
    // Degradación con gracia: heurística + aviso de que Gemini falló.
    return NextResponse.json({
      success: true,
      concepts: heuristicConcepts(fullText, existing),
      source: 'heuristic',
      warning: 'La IA no estuvo disponible; se usó una sugerencia heurística.',
    });
  }
}
