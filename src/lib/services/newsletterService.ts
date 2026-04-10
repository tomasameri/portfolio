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
