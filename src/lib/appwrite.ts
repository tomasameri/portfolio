import { Client, Account, Databases, Storage, ID } from 'appwrite';

// --------------------------------------------------------------------------
// NOTA IMPORTANTE:
// En Next.js (Cliente), las variables deben escribirse explícitamente
// (process.env.NEXT_PUBLIC_...) para que el bundler las detecte.
// El acceso dinámico `process.env[key]` NO funciona en el navegador.
// --------------------------------------------------------------------------

// 1. Configuración de Variables (Acceso Directo)
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// 2. Inicializar Cliente
const client = new Client();

if (projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
} else {
  if (typeof window !== 'undefined') {
    console.error('🚨 Error Crítico: No se encontró el PROJECT_ID de Appwrite. Revisa src/lib/appwrite.ts y tu .env.local');
  }
}

// 3. Exportar IDs (Funciones explícitas)
export function getDatabaseId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
}

export function getCardsCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID || '';
}

export function getBlogCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID || '';
}

export function getStorageBucketId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '';
}

// Constantes para compatibilidad
export const DATABASE_ID = getDatabaseId();
export const CARDS_COLLECTION_ID = getCardsCollectionId();
export const BLOG_COLLECTION_ID = getBlogCollectionId();
export const STORAGE_BUCKET_ID = getStorageBucketId();

// 4. Configuración Server-Side (Solo Node.js)
const serverApiKey = process.env.APPWRITE_API_KEY;
let serverClient: Client | null = null;

if (typeof window === 'undefined' && serverApiKey && projectId) {
  serverClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setDevKey(serverApiKey);
}

// 5. Exportar Servicios
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Servicios Server-side
export const serverDatabases = serverClient ? new Databases(serverClient) : null;
export const serverStorage = serverClient ? new Storage(serverClient) : null;
export const serverAccount = serverClient ? new Account(serverClient) : null;

export { ID };
export default client;