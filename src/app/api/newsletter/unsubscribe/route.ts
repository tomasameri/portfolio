import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeContact } from '@/lib/services/newsletterService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email faltante.' }, { status: 400 });
  }

  try {
    const success = await unsubscribeContact(email);
    
    // Devolvemos un HTML simple para que el usuario reciba feedback directo en el navegador
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Desuscripción - Tomás Ameri</title>
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f9fafb; margin: 0; }
          .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          h1 { color: ${success ? '#111827' : '#ef4444'}; margin-top: 0; }
          p { color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${success ? 'Baja exitosa' : 'Aviso'}</h1>
          <p>${success ? 'Se ha dado de baja tu correo exitosamente. Ya no recibirás más notificaciones de nuevos artículos.' : 'Hubo un problema o este correo ya estaba dado de baja.'}</p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fallo al procesar la desuscripción.' }, { status: 500 });
  }
}
