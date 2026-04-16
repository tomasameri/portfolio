import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterBroadcast } from '@/lib/services/newsletterService';

export async function POST(request: NextRequest) {
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
      { success: false, error: 'Error al enviar el newsletter.', details: error?.message },
      { status: 500 }
    );
  }
}
