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

/**
 * Enviar un email masivo a todos los contactos activos de la audiencia.
 * Usa resend.batch.send para enviar individualmente a cada uno y evitar que se vean las direcciones.
 */
export async function sendNewsletterBroadcast(post: { title: string; excerpt: string; slug: string }) {
  const contacts = await getNewsletterContacts();

  if (!contacts || contacts.length === 0) {
    return { success: false, message: 'No hay contactos activos en la audiencia.' };
  }

  // Usamos un sender por defecto si no está configurado en .env
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Tomas Ameri <hola@tomasameri.com>';
  const domainUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tomasameri.com';

  const emailsToSend = contacts.map((contact) => ({
    from: fromEmail,
    to: [contact.email],
    subject: `Nuevo artículo: ${post.title}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #111827; font-size: 24px;">${post.title}</h2>
        <p style="font-size: 16px; color: #4b5563;">
          ${post.excerpt}
        </p>
        <div style="margin-top: 30px; margin-bottom: 30px;">
          <a href="${domainUrl}/blog/${post.slug}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Leer artículo completo
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          Recibís este correo porque estás suscrito a los artículos de mi portfolio.<br/>
          Si ya no querés recibir mis artículos, podés <a href="${domainUrl}/api/newsletter/unsubscribe?email=${contact.email}" style="color: #9ca3af; text-decoration: underline;">darte de baja acá</a>.
        </p>
      </div>
    `,
  }));

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
