import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook de Resend — recibe eventos de email y contactos.
 *
 * Configuración en Resend Dashboard → Webhooks:
 *   URL: https://tudominio.com/api/newsletter/webhook
 *   Eventos a suscribir: email.bounced, email.complained, email.suppressed, contact.updated
 *
 * NOTA: NO existe `contact.unsubscribed` en Resend.
 * Las bajas voluntarias llegan como `contact.updated` con `unsubscribed: true` en el payload.
 *
 * Para verificar la firma, añadir RESEND_WEBHOOK_SECRET al .env.local
 * (se obtiene al crear el webhook en el Dashboard de Resend).
 */

interface ResendWebhookEvent {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    from?: string;
    // Payload de contact.*
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    unsubscribed?: boolean;
    audience_id?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

async function verifySignature(
  request: NextRequest,
  rawBody: string
): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  // Sin secret configurado, omitimos verificación (aceptable en desarrollo local)
  if (!secret) {
    console.warn('[webhook] RESEND_WEBHOOK_SECRET no configurado — omitiendo verificación');
    return true;
  }

  const signatureHeader =
    request.headers.get('svix-signature') ??
    request.headers.get('resend-signature');
  if (!signatureHeader) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const [, signatureB64] = signatureHeader.split(',');
    const signatureBytes = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));
    const bodyBytes = new TextEncoder().encode(rawBody);
    return await crypto.subtle.verify('HMAC', key, signatureBytes, bodyBytes);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const isValid = await verifySignature(request, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  console.log(`[webhook] Evento: ${event.type}`);

  switch (event.type) {
    case 'email.bounced': {
      const emails = event.data.to ?? [];
      console.log(`[webhook] Bounce para: ${emails.join(', ')}`);
      break;
    }

    case 'email.complained': {
      const emails = event.data.to ?? [];
      console.log(`[webhook] Queja (spam) de: ${emails.join(', ')}`);
      break;
    }

    case 'email.suppressed': {
      // Bounce duro o queja previa — Resend suprime permanentemente
      const emails = event.data.to ?? [];
      console.log(`[webhook] Email suprimido: ${emails.join(', ')}`);
      break;
    }

    case 'contact.updated': {
      // Este es el evento real de baja voluntaria en Resend.
      // Cuando el usuario hace click en el link de unsubscribe del email,
      // Resend actualiza el contacto con unsubscribed: true y dispara contact.updated.
      if (event.data.unsubscribed === true) {
        console.log(`[webhook] Baja voluntaria: ${event.data.email}`);
        // Resend ya marca al contacto como unsubscribed y deja de enviarle emails.
        // Si en el futuro querés sincronizar con otra BD, hacelo acá.
      }
      break;
    }

    case 'contact.created':
    case 'contact.deleted':
    case 'email.delivered':
    case 'email.opened':
    case 'email.clicked':
    case 'email.sent':
      // Eventos informativos — sin acción requerida
      break;

    default:
      console.log(`[webhook] Evento no manejado: ${event.type}`);
  }

  // Siempre 200 para que Resend no reintente el envío
  return NextResponse.json({ received: true });
}
