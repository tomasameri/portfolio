import { Client, Account, Databases, Storage, ID } from 'appwrite';

// --------------------------------------------------------------------------
// CONFIGURACIÓN DE APPWRITE PARA NEXT.JS
// 
// IMPORTANTE:
// - Variables NEXT_PUBLIC_* son expuestas al navegador (seguro para Appwrite)
// - Variables sin NEXT_PUBLIC_ solo están disponibles en el servidor
// - El acceso dinámico `process.env[key]` NO funciona en el navegador
// --------------------------------------------------------------------------

// 1. Configuración de Variables de Entorno
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

// Validación de variables críticas (solo en desarrollo)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  if (!projectId) {
    console.warn('⚠️  NEXT_PUBLIC_APPWRITE_PROJECT_ID no está configurado');
  }
  if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
    console.warn('⚠️  NEXT_PUBLIC_APPWRITE_DATABASE_ID no está configurado');
  }
}

// 2. Función para obtener el cliente del navegador (client-side)
function getClient(): Client {
  const client = new Client();
  
  if (projectId) {
    client.setEndpoint(endpoint).setProject(projectId);
  } else {
    if (typeof window !== 'undefined') {
      console.error('🚨 Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID no está configurado');
    }
  }
  
  return client;
}

// 3. Función para obtener el cliente del servidor (server-side)
// Solo funciona en Node.js, no en el navegador
// IMPORTANTE: Esta función se llama lazy (solo cuando se necesita) para evitar errores en el cliente
function getServerClient(): Client | null {
  // Verificar que estamos en el servidor
  if (typeof window !== 'undefined') {
    return null; // Retornar null en lugar de lanzar error para evitar problemas en el bundler
  }
  
  const serverApiKey = process.env.APPWRITE_API_KEY;
  
  if (!serverApiKey || !projectId) {
    return null;
  }
  
  const client = new Client();
  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setDevKey(serverApiKey); // En SDK v21.x, setDevKey() se usa con API Keys del servidor
  
  return client;
}

// 4. Inicializar cliente del navegador (client-side)
const client = getClient();

// 5. Exportar funciones helper para IDs
export function getDatabaseId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
}

export function getCardsCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID || '';
}

export function getBlogCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID || '';
}

export function getProjectsCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || '';
}

export function getNewsletterCollectionId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID || '';
}

export function getStorageBucketId(): string {
  return process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '';
}

// Constantes para compatibilidad (usar con precaución en SSR)
export const DATABASE_ID = getDatabaseId();
export const CARDS_COLLECTION_ID = getCardsCollectionId();
export const BLOG_COLLECTION_ID = getBlogCollectionId();
export const STORAGE_BUCKET_ID = getStorageBucketId();

// 6. Exportar Servicios Client-Side
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// 7. Servicios Server-Side (solo disponibles en Node.js)
// Se inicializan lazy para evitar errores cuando el módulo se carga en el cliente
let _serverDatabases: Databases | null = null;
let _serverStorage: Storage | null = null;
let _serverAccount: Account | null = null;

function initServerServices() {
  if (typeof window !== 'undefined') {
    return; // No inicializar en el cliente
  }
  
  const serverClient = getServerClient();
  if (serverClient && !_serverDatabases) {
    _serverDatabases = new Databases(serverClient);
    _serverStorage = new Storage(serverClient);
    _serverAccount = new Account(serverClient);
  }
}

// Inicializar servicios del servidor solo si estamos en Node.js
if (typeof window === 'undefined') {
  initServerServices();
}

// Exportar servicios (serán null en el cliente, válidos en el servidor)
export const serverDatabases = _serverDatabases;
export const serverStorage = _serverStorage;
export const serverAccount = _serverAccount;

// 8. Exportar funciones helper para obtener clientes
export { getClient, getServerClient };

export { ID };
export default client;