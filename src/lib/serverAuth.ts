import { Client, Account, type Models } from 'node-appwrite';

/**
 * Verifica un JWT de Appwrite enviado por el cliente en el header Authorization.
 *
 * El panel admin genera el JWT con `account.createJWT()` (SDK web) y lo manda como
 * `Authorization: Bearer <jwt>`. Acá lo validamos contra Appwrite: si el token es
 * válido, `account.get()` devuelve el usuario; si no, tira y retornamos null.
 */
export async function getUserFromRequest(
  request: Request
): Promise<Models.User<Models.Preferences> | null> {
  const authHeader = request.headers.get('authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!jwt) return null;

  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setJWT(jwt);

    const account = new Account(client);
    return await account.get();
  } catch {
    return null;
  }
}

/**
 * Determina si un usuario autenticado puede ejecutar acciones de admin.
 *
 * Si está seteado `ADMIN_USER_ID`, sólo ese usuario puntual queda autorizado.
 * Si no, basta con ser un usuario autenticado de Appwrite (el proyecto es de un
 * único dueño, así que cualquier sesión válida es el admin).
 */
export function isAuthorizedAdmin(
  user: Models.User<Models.Preferences> | null
): boolean {
  if (!user) return false;
  const adminId = process.env.ADMIN_USER_ID;
  if (adminId) return user.$id === adminId;
  return true;
}

/**
 * Atajo: valida la request y devuelve el usuario admin o null.
 */
export async function requireAdmin(
  request: Request
): Promise<Models.User<Models.Preferences> | null> {
  const user = await getUserFromRequest(request);
  return isAuthorizedAdmin(user) ? user : null;
}
