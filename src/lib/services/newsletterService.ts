import { Resend } from 'resend';

// Server-side only — nunca exponer RESEND_API_KEY al cliente
const resend = new Resend(process.env.RESEND_API_KEY);

function getAudienceId(): string {
  const id = process.env.RESEND_AUDIENCE_ID;
  if (!id) throw new Error('RESEND_AUDIENCE_ID no está configurado en .env.local');
  return id;
}

/**
 * Añade un contacto a la Audience de Resend.
 * Resend deduplica por email automáticamente.
 * Si el contacto ya existía pero estaba unsubscribed, lo reactiva.
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string
): Promise<{ success: boolean; id?: string }> {
  const audienceId = getAudienceId();

  const { data, error } = await resend.contacts.create({
    email: email.toLowerCase().trim(),
    firstName: firstName?.trim(),
    unsubscribed: false,
    audienceId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, id: data?.id };
}

/**
 * Obtener todos los contactos activos de la Audience.
 * Útil para el panel de admin (futuro).
 */
export async function getNewsletterContacts() {
  const audienceId = getAudienceId();

  const { data, error } = await resend.contacts.list({ audienceId });

  if (error) throw new Error(error.message);

  return (data?.data ?? []).filter((c) => !c.unsubscribed);
}

/**
 * Dar de baja un contacto manualmente por email.
 * Normalmente Resend lo hace automático desde el link del email.
 */
export async function unsubscribeContact(email: string): Promise<boolean> {
  const audienceId = getAudienceId();

  // Buscar el contacto por email
  const { data, error } = await resend.contacts.list({ audienceId });
  if (error || !data) return false;

  const contact = data.data.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  );
  if (!contact) return false;

  const { error: updateError } = await resend.contacts.update({
    audienceId,
    id: contact.id,
    unsubscribed: true,
  });

  return !updateError;
}

/** Escapa caracteres que romperían el HTML (o permitirían inyección) en el email. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface NewsletterPost {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  readingTime?: number;
}

/**
 * Plantilla HTML del email, alineada con la marca del sitio
 * (gunmetal #37393a + cool-sky #77b6ea). Usa tablas e inline-styles
 * para máxima compatibilidad con clientes de correo.
 */
export function renderNewsletterHtml(
  post: NewsletterPost,
  articleUrl: string,
  unsubscribeUrl: string
): string {
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt || '');
  const meta = post.readingTime
    ? `${post.readingTime} min de lectura`
    : '';

  const cover = post.coverImage
    ? `<tr><td style="padding:0;">
         <a href="${articleUrl}" style="text-decoration:none;">
           <img src="${escapeHtml(post.coverImage)}" alt="${title}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:16px;" />
         </a>
       </td></tr>
       <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>`
    : '';

  const metaLine = meta
    ? `<tr><td style="padding:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#8a8f92;">${meta}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#e8eef2;">
  <!-- preheader oculto: texto de vista previa en la bandeja -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${excerpt}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8eef2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(55,57,58,0.08);">
          <!-- header de marca -->
          <tr>
            <td style="background-color:#37393a;padding:24px 32px;">
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.3px;color:#ffffff;">Tomas Ameri</span>
              <span style="float:right;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#77b6ea;">Nuevo artículo</span>
            </td>
          </tr>
          <!-- cuerpo -->
          <tr>
            <td style="padding:36px 32px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${cover}
                <tr>
                  <td style="padding:0 0 14px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:26px;line-height:1.25;font-weight:800;color:#37393a;">
                    ${title}
                  </td>
                </tr>
                ${metaLine}
                <tr>
                  <td style="padding:0 0 28px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#4b5563;">
                    ${excerpt}
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:12px;background-color:#77b6ea;">
                          <a href="${articleUrl}" style="display:inline-block;padding:14px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#37393a;text-decoration:none;border-radius:12px;">
                            Leer artículo completo →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9ca3af;text-align:center;">
                Recibís este correo porque te suscribiste a los artículos de mi portfolio.<br/>
                ¿Ya no querés recibirlos? <a href="${unsubscribeUrl}" style="color:#77b6ea;text-decoration:underline;">Darte de baja</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Enviar un email masivo a todos los contactos activos de la audiencia.
 * Usa resend.batch.send para enviar individualmente a cada uno y evitar que se vean las direcciones.
 */
export async function sendNewsletterBroadcast(post: NewsletterPost) {
  const contacts = await getNewsletterContacts();

  if (!contacts || contacts.length === 0) {
    return { success: false, message: 'No hay contactos activos en la audiencia.' };
  }

  // Usamos un sender por defecto si no está configurado en .env
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Tomas Ameri <hola@tomasameri.com>';
  const domainUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tomasameri.com').replace(/\/$/, '');
  const articleUrl = `${domainUrl}/blog/${post.slug}`;

  const emailsToSend = contacts.map((contact) => {
    const unsubscribeUrl = `${domainUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(contact.email)}`;
    return {
      from: fromEmail,
      to: [contact.email],
      subject: `Nuevo artículo: ${post.title}`,
      // Cabeceras estándar para que Gmail/Outlook muestren el botón nativo de baja.
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: renderNewsletterHtml(post, articleUrl, unsubscribeUrl),
    };
  });

  try {
    // resend.batch.send envía hasta 100 emails a la vez. Como esto es un portfolio, por ahora bastará.
    // Si la lista supera 100, se debería hacer un loop cortando el array en fragmentos de a 100.
    const chunks = [];
    for (let i = 0; i < emailsToSend.length; i += 100) {
      chunks.push(emailsToSend.slice(i, i + 100));
    }

    let successCount = 0;
    for (const chunk of chunks) {
      const { error } = await resend.batch.send(chunk);
      if (error) {
        console.error('[Resend Batch Error]', error);
        throw new Error(error.message);
      }
      successCount += chunk.length;
    }

    return { success: true, count: successCount };
  } catch (err: any) {
    throw new Error(err.message);
  }
}
