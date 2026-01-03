/**
 * Script para configurar automáticamente las colecciones y atributos en Appwrite
 * 
 * Ejecutar con: npx tsx scripts/setupCollections.ts
 * 
 * IMPORTANTE: Necesitas tener configurada la variable APPWRITE_API_KEY en tu .env.local
 * Esta es una API key de servidor que puedes obtener en Appwrite Console → Settings → API Keys
 */

// IMPORTANTE: Cargar variables de entorno ANTES de importar cualquier módulo que las use
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar .env.local primero
config({ path: resolve(process.cwd(), '.env.local') });

// Verificar que las variables críticas estén configuradas
const requiredVars = [
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID',
  'APPWRITE_API_KEY',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPor favor, configura estas variables en tu archivo .env.local');
  console.error('\n💡 Para obtener APPWRITE_API_KEY:');
  console.error('   1. Ve a Appwrite Console → Settings → API Keys');
  console.error('   2. Crea una nueva API Key con permisos de "Administrator"');
  console.error('   3. Copia la clave y agrégala a tu .env.local como APPWRITE_API_KEY=tu-clave-aqui');
  process.exit(1);
}

console.log('✓ Variables de entorno cargadas correctamente');
console.log(`  Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
console.log(`  Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.substring(0, 8)}...`);
console.log(`  Database ID: ${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID?.substring(0, 8)}...\n`);

// Ahora importar node-appwrite (SDK del servidor) para operaciones administrativas
import { Client, Databases, IndexType } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const cardsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID!;
const blogCollectionId = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID!;
const projectsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

// Crear cliente de servidor con API key usando node-appwrite
// node-appwrite usa setKey() para API keys del servidor
const serverClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(serverClient);

// Definición de atributos para la colección de cards
// NOTA: Los atributos requeridos NO pueden tener valores por defecto en Appwrite
const cardsAttributes = [
  { key: 'type', type: 'string', size: 50, required: true },
  { key: 'size', type: 'string', size: 20, required: true },
  { key: 'title', type: 'string', size: 500, required: false },
  { key: 'description', type: 'string', size: 1000, required: false },
  { key: 'url', type: 'string', size: 2000, required: false },
  { key: 'socialPlatform', type: 'string', size: 50, required: false },
  { key: 'socialUsername', type: 'string', size: 100, required: false },
  { key: 'image', type: 'string', size: 500, required: false },
  { key: 'imageAsBackground', type: 'boolean', required: false },
  { key: 'icon', type: 'string', size: 500, required: false },
  { key: 'order', type: 'integer', required: true, min: 0, max: 9999 }, // Sin default porque es required
  // Campos de layout para React Grid Layout
  { key: 'layoutX', type: 'integer', required: false, min: 0, max: 10 },
  { key: 'layoutY', type: 'integer', required: false, min: 0, max: 100 },
  { key: 'layoutW', type: 'integer', required: false, min: 1, max: 3 },
  { key: 'layoutH', type: 'integer', required: false, min: 1, max: 3 },
];

// Definición de atributos para la colección de blog
// NOTA: Los atributos requeridos NO pueden tener valores por defecto en Appwrite
const blogAttributes = [
  { key: 'title', type: 'string', size: 500, required: true },
  { key: 'slug', type: 'string', size: 500, required: true },
  { key: 'excerpt', type: 'string', size: 1000, required: true },
  { key: 'content', type: 'string', size: 100000, required: true },
  { key: 'published', type: 'boolean', required: true }, // Sin default porque es required
  { key: 'publishedAt', type: 'string', size: 100, required: false },
  { key: 'authorId', type: 'string', size: 100, required: true },
];

// Definición de atributos para la colección de proyectos
const projectsAttributes = [
  { key: 'title', type: 'string', size: 500, required: true },
  { key: 'slug', type: 'string', size: 500, required: true },
  { key: 'description', type: 'string', size: 1000, required: true },
  { key: 'longDescription', type: 'string', size: 2000, required: false },
  { key: 'technologies', type: 'string', size: 1000, required: false }, // JSON array como string
  { key: 'image', type: 'string', size: 500, required: false },
  { key: 'url', type: 'string', size: 500, required: false },
  { key: 'githubUrl', type: 'string', size: 500, required: false },
  { key: 'featured', type: 'boolean', required: false },
  { key: 'order', type: 'integer', required: false, min: 0, max: 9999 },
];

async function createAttribute(
  collectionId: string,
  attribute: any,
  collectionName: string
): Promise<boolean> {
  try {
    if (attribute.type === 'string') {
      // createStringAttribute(databaseId, collectionId, key, size, required, default?, array?)
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.size,
        attribute.required,
        undefined, // default value (opcional)
        false      // array (opcional, false por defecto)
      );
    } else if (attribute.type === 'integer') {
      // createIntegerAttribute(databaseId, collectionId, key, required, min?, max?, default?)
      // IMPORTANTE: Si el atributo es required, NO se puede establecer default
      const defaultValue = attribute.required ? undefined : (attribute.default ?? undefined);
      await databases.createIntegerAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        attribute.min ?? undefined,
        attribute.max ?? undefined,
        defaultValue
      );
    } else if (attribute.type === 'boolean') {
      // createBooleanAttribute(databaseId, collectionId, key, required, default?)
      // IMPORTANTE: Si el atributo es required, NO se puede establecer default
      const defaultValue = attribute.required ? undefined : (attribute.default ?? undefined);
      await databases.createBooleanAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        defaultValue
      );
    }
    
    console.log(`  ✓ Atributo "${attribute.key}" creado`);
    return true;
  } catch (error: any) {
    // Si el atributo ya existe, está bien (código 409)
    if (error.code === 409 || 
        error.message?.includes('already exists') ||
        error.message?.includes('duplicate') ||
        error.type === 'document_already_exists') {
      console.log(`  ⊙ Atributo "${attribute.key}" ya existe, omitiendo...`);
      return true;
    }
    
    // Log detallado del error para debugging
    console.error(`  ✗ Error creando atributo "${attribute.key}":`);
    console.error(`     Código: ${error.code || 'N/A'}`);
    console.error(`     Mensaje: ${error.message || error}`);
    if (error.response) {
      console.error(`     Respuesta: ${JSON.stringify(error.response)}`);
    }
    
    return false;
  }
}

async function createIndex(
  collectionId: string,
  key: string,
  attributeKey: string,
  type: IndexType = IndexType.Key
): Promise<boolean> {
  try {
    await databases.createIndex(
      databaseId,
      collectionId,
      key,
      type,
      [attributeKey]
    );
    console.log(`  ✓ Índice "${key}" creado para atributo "${attributeKey}"`);
    return true;
  } catch (error: any) {
    // Si el índice ya existe, está bien
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log(`  ⊙ Índice "${key}" ya existe, omitiendo...`);
      return true;
    }
    console.error(`  ✗ Error creando índice "${key}":`, error.message || error);
    return false;
  }
}

async function setupCollection(
  collectionId: string,
  collectionName: string,
  attributes: any[],
  indexes: { key: string; type?: string }[] = []
) {
  console.log(`\n📦 Configurando colección "${collectionName}" (${collectionId})...`);
  
  let successCount = 0;
  let skipCount = 0;
  
  // Crear atributos
  for (const attribute of attributes) {
    const result = await createAttribute(collectionId, attribute, collectionName);
    if (result) {
      if (attribute.key === 'slug' || attribute.key === 'type') {
        // Esperar un poco para que Appwrite procese el atributo antes de crear el índice
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Esperar un poco menos para otros atributos
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      successCount++;
    } else {
      skipCount++;
    }
  }
  
  // Crear índices
  if (indexes.length > 0) {
    console.log(`\n  Creando índices...`);
    for (const index of indexes) {
      // Para índices únicos, el atributo es 'slug' pero el nombre del índice es 'slug_unique'
      const attributeKey = index.key.replace('_unique', '');
      const indexType = index.type === 'key' ? IndexType.Key : 
                        index.type === 'fulltext' ? IndexType.Fulltext : 
                        IndexType.Unique;
      await createIndex(collectionId, index.key, attributeKey, indexType);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n✅ Colección "${collectionName}" configurada: ${successCount} atributos procesados`);
  if (skipCount > 0) {
    console.log(`   (${skipCount} atributos ya existían)`);
  }
}

async function setupCollections() {
  try {
    console.log('🚀 Iniciando configuración de colecciones en Appwrite...\n');
    
    // Configurar colección de cards
    await setupCollection(
      cardsCollectionId,
      'cards',
      cardsAttributes
    );
    
    // Configurar colección de blog con índice único para slug
    await setupCollection(
      blogCollectionId,
      'blogPosts',
      blogAttributes,
      [{ key: 'slug_unique', type: 'unique' }]
    );
    
    // Configurar colección de proyectos con índice único para slug
    await setupCollection(
      projectsCollectionId,
      'projects',
      projectsAttributes,
      [{ key: 'slug_unique', type: 'unique' }]
    );
    
    console.log('\n✅ ¡Configuración completada exitosamente!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Configura los permisos en Appwrite Console:');
    console.log('      - Cards: Read para "any", Write para "users"');
    console.log('      - BlogPosts: Read para "any", Write para "users"');
    console.log('      - Projects: Read para "any", Write para "users"');
    console.log('   2. Ejecuta los scripts de migración si necesitas datos de ejemplo:');
    console.log('      - npx tsx scripts/migrateCards.ts');
    console.log('      - npx tsx scripts/migrateBlogPosts.ts');
    
  } catch (error: any) {
    console.error('\n❌ Error durante la configuración:', error.message || error);
    if (error.code === 401 || error.code === 403) {
      console.error('\n💡 El error de autenticación puede significar que:');
      console.error('   1. La API Key no tiene permisos de administrador');
      console.error('   2. La API Key es incorrecta');
      console.error('   3. El Project ID es incorrecto');
    }
    process.exit(1);
  }
}

setupCollections();

