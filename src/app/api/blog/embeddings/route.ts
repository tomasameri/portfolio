import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/serverAuth';

/**
 * Genera el embedding (vector semántico) de un post para conectar en el grafo
 * artículos temáticamente relacionados, aunque no compartan el mismo texto de
 * concepto (ej. "React" ≈ "Next.js").
 *
 * Se calcula UNA vez al guardar y se persiste en el post; el grafo luego computa
 * la similitud coseno en el cliente (gratis). Modelo barato: gemini-embedding-001.
 */

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
// Dimensión reducida (MRL): suficiente para similitud y liviana para enviar al cliente.
const OUTPUT_DIM = 256;
const MAX_TEXT_CHARS = 8000;

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'GEMINI_API_KEY no configurada.' },
      { status: 501 }
    );
  }

  let text = '';
  try {
    const body = await request.json();
    text = (body?.text || '').toString().trim();
  } catch {
    return NextResponse.json({ success: false, error: 'Body inválido.' }, { status: 400 });
  }

  if (text.length < 5) {
    return NextResponse.json(
      { success: false, error: 'Texto insuficiente para generar embedding.' },
      { status: 400 }
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: text.slice(0, MAX_TEXT_CHARS) }] },
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: OUTPUT_DIM,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[blog/embeddings]', res.status, detail.slice(0, 300));
      return NextResponse.json(
        { success: false, error: `Gemini ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const values: number[] | undefined = data?.embedding?.values;
    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Respuesta de embedding vacía.' },
        { status: 502 }
      );
    }

    // Redondeamos para achicar el JSON que se guarda y se envía al cliente.
    const embedding = values.map((v) => Number(v.toFixed(5)));
    return NextResponse.json({ success: true, embedding });
  } catch (error: any) {
    console.error('[blog/embeddings]', error?.message ?? error);
    return NextResponse.json(
      { success: false, error: 'Error generando el embedding.' },
      { status: 500 }
    );
  }
}
