import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Obtener variables de entorno de forma segura
// Las variables NEXT_PUBLIC_* están disponibles tanto en servidor como cliente
function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof process === 'undefined' || !process.env) {
    return defaultValue;
  }
  const fullKey = `NEXT_PUBLIC_${key}`;
  // En Node.js (scripts), process.env está disponible directamente
  // En el navegador, Next.js inyecta las variables NEXT_PUBLIC_*
  const value = process.env[fullKey];
  return value || defaultValue;
}

// Configuración del cliente Appwrite
const endpoint = getEnvVar('APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1');
const projectId = getEnvVar('APPWRITE_PROJECT_ID');

const client = new Client();

// Solo configurar si tenemos el projectId
if (projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

// Servicios exportados
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// IDs de configuración - funciones para leer dinámicamente
export function getDatabaseId(): string {
  return getEnvVar('APPWRITE_DATABASE_ID');
}

export function getCardsCollectionId(): string {
  return getEnvVar('APPWRITE_CARDS_COLLECTION_ID');
}

export function getBlogCollectionId(): string {
  return getEnvVar('APPWRITE_BLOG_COLLECTION_ID');
}

export function getStorageBucketId(): string {
  return getEnvVar('APPWRITE_STORAGE_BUCKET_ID') || '694d8d5500037f02535b';
}

// Mantener constantes para compatibilidad (se evalúan al importar)
export const DATABASE_ID = getDatabaseId();
export const CARDS_COLLECTION_ID = getCardsCollectionId();
export const BLOG_COLLECTION_ID = getBlogCollectionId();
export const STORAGE_BUCKET_ID = getStorageBucketId();

// Helper para IDs
export { ID };

export default client;

