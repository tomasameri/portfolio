import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

// Mapa para rate limiting básico en memoria
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Rate limiting básico por IP
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hora
    
    if (ip !== 'unknown') {
      const userLimit = rateLimitMap.get(ip);
      if (userLimit) {
        if (now - userLimit.timestamp < windowMs) {
          if (userLimit.count >= 3) {
            return NextResponse.json(
              { error: 'Has enviado demasiados mensajes. Por favor, intenta de nuevo en una hora.' },
              { status: 429 }
            );
          }
          userLimit.count += 1;
        } else {
          // Resetear ventana
          rateLimitMap.set(ip, { count: 1, timestamp: now });
        }
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    }

    // Validación de todos los campos
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos (nombre, email, asunto y mensaje) son obligatorios.' },
        { status: 400 }
      );
    }

    // Enviamos el correo a través de Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <noreply@tomasameri.com>',
      to: 'tomasameri@gmail.com',
      replyTo: email,
      subject: `[Portfolio] Mensaje de: ${name} - ${subject || 'Sin asunto'}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #f3f4f6;">
            <h1 style="color: #111827; font-size: 24px; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">Nuevo Mensaje del Portfolio</h1>
            
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Detalles del Contacto</p>
              <table style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; width: 30%; color: #4b5563; font-weight: 600; font-size: 14px;">Nombre</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-weight: 600; font-size: 14px;">Email</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #4b5563; font-weight: 600; font-size: 14px;">Asunto</td>
                  <td style="padding: 12px 16px; color: #111827; font-size: 15px;">${subject || 'No especificado'}</td>
                </tr>
              </table>
            </div>
            
            <div>
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Mensaje</p>
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; color: #1f2937; font-size: 16px; line-height: 1.6;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">Este mensaje fue enviado desde el formulario de contacto de tu portfolio.</p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error en Route Handler de contacto:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor.' },
      { status: 500 }
    );
  }
}
