import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Obtener variables de entorno de forma segura
// Las variables NEXT_PUBLIC_* están disponibles tanto en servidor como cliente
function getEnvVar(key: string, defaultValue: string = '', isPublic: boolean = true): string {
  if (typeof process === 'undefined' || !process.env) {
    return defaultValue;
  }
  const fullKey = isPublic ? `NEXT_PUBLIC_${key}` : key;
  // En Node.js (scripts), process.env está disponible directamente
  // En el navegador, Next.js inyecta las variables NEXT_PUBLIC_*
  const value = process.env[fullKey];
  return value || defaultValue;
}

// Configuración del cliente Appwrite para cliente (browser)
const endpoint = getEnvVar('APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1');
const projectId = getEnvVar('APPWRITE_PROJECT_ID');

const client = new Client();

// Solo configurar si tenemos el projectId
if (projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

// Cliente para operaciones server-side con API Key (solo disponible en servidor)
// La API key NO debe tener el prefijo NEXT_PUBLIC_ porque es secreta
function getServerApiKeyInternal(): string {
  if (typeof process === 'undefined' || !process.env) {
    return '';
  }
  // API key es secreta, NO usar NEXT_PUBLIC_
  return process.env.APPWRITE_API_KEY || '';
}

const serverApiKey = getServerApiKeyInternal();

// Crear cliente server-side si tenemos API key (solo en servidor)
// En Appwrite SDK, las API keys se configuran usando setDevKey()
// Esto permite operaciones server-side que bypass permisos
let serverClient: Client | null = null;
if (typeof window === 'undefined' && serverApiKey && projectId) {
  serverClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setDevKey(serverApiKey); // Configurar API key para operaciones server-side
}

// Servicios exportados (client-side - usa sesiones de usuario)
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Servicios server-side (solo disponibles en servidor, usan API key)
// Estos bypass los permisos y se usan en API routes o Server Components
// El cliente serverClient ya tiene la API key configurada con setDevKey()
export const serverDatabases = serverClient ? new Databases(serverClient) : null;
export const serverStorage = serverClient ? new Storage(serverClient) : null;
export const serverAccount = serverClient ? new Account(serverClient) : null;

// Función helper para obtener la API key (solo disponible server-side)
export function getServerApiKey(): string {
  return serverApiKey;
}

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

