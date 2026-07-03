import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterBroadcast } from '@/lib/services/newsletterService';
import { requireAdmin } from '@/lib/serverAuth';

export async function POST(request: NextRequest) {
  // 🔒 Sólo un admin autenticado puede disparar un envío masivo.
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'No autorizado.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, excerpt, slug } = body as { title?: string; excerpt?: string; slug?: string; };

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos del post (title, slug).' },
        { status: 400 }
      );
    }

    const result = await sendNewsletterBroadcast({ title, excerpt: excerpt || '', slug });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[newsletter/send]', error?.message ?? error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar el newsletter.' },
      { status: 500 }
    );
  }
}
