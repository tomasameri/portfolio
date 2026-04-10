import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/services/newsletterService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body as { email: string; firstName?: string };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    await subscribeToNewsletter(email, firstName);

    return NextResponse.json({
      success: true,
      message: '¡Suscripto! Te aviso cuando publique algo nuevo.',
    });
  } catch (error: any) {
    console.error('[newsletter/subscribe]', error?.message ?? error);

    // Resend devuelve 409 si ya existe el contacto (y está unsubscribed=false)
    // En ese caso igual tratamos como éxito
    if (error?.message?.toLowerCase().includes('already exists') ||
        error?.statusCode === 409) {
      return NextResponse.json({
        success: true,
        message: '¡Ya estabas suscripto! Te avisaremos con cada nuevo artículo.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'No se pudo completar la suscripción. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}
