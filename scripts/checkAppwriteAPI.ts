/**
 * Script para verificar qué API de Appwrite estás usando
 * 
 * Ejecutar con: npx tsx scripts/checkAppwriteAPI.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const requiredVars = [
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'APPWRITE_API_KEY',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan variables de entorno:', missingVars.join(', '));
  process.exit(1);
}

import { Client, Databases } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function checkAPI() {
  try {
    console.log('🔍 Verificando API de Appwrite...\n');
    
    // Intentar listar collections (API Legacy)
    console.log('1. Intentando listar Collections (API Legacy)...');
    try {
      const collections = await databases.listCollections(databaseId);
      console.log(`   ✅ API Legacy disponible - Encontradas ${collections.collections.length} collections`);
      
      if (collections.collections.length > 0) {
        console.log('\n   Collections encontradas:');
        collections.collections.forEach((col: any) => {
          console.log(`   - ${col.name} (ID: ${col.$id})`);
        });
      } else {
        console.log('   ⚠️  No hay collections creadas');
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('\n2. Verificando configuración...');
    console.log(`   Database ID: ${databaseId}`);
    console.log(`   Collection ID (cards): ${process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID || 'No configurado'}`);
    console.log(`   Collection ID (blog): ${process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID || 'No configurado'}`);
    
    // Si hay collection IDs configurados, verificar si existen
    const cardsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID;
    const blogCollectionId = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID;
    
    if (cardsCollectionId) {
      console.log(`\n3. Verificando collection "cards" (${cardsCollectionId})...`);
      try {
        const collection = await databases.getCollection(databaseId, cardsCollectionId);
        console.log(`   ✅ Collection encontrada: ${collection.name}`);
        
        // Intentar listar atributos
        try {
          const attributes = await databases.listAttributes(databaseId, cardsCollectionId);
          console.log(`   📋 Atributos encontrados: ${attributes.attributes.length}`);
          if (attributes.attributes.length > 0) {
            attributes.attributes.forEach((attr: any) => {
              console.log(`      - ${attr.key} (${attr.type})`);
            });
          } else {
            console.log('   ⚠️  No hay atributos definidos. Necesitas ejecutar setupCollections.ts');
          }
        } catch (error: any) {
          console.log(`   ⚠️  No se pudieron listar atributos: ${error.message}`);
        }
      } catch (error: any) {
        console.log(`   ❌ Collection no encontrada: ${error.message}`);
        console.log(`   💡 Verifica que el Collection ID sea correcto`);
      }
    }
    
    if (blogCollectionId) {
      console.log(`\n4. Verificando collection "blogPosts" (${blogCollectionId})...`);
      try {
        const collection = await databases.getCollection(databaseId, blogCollectionId);
        console.log(`   ✅ Collection encontrada: ${collection.name}`);
        
        // Intentar listar atributos
        try {
          const attributes = await databases.listAttributes(databaseId, blogCollectionId);
          console.log(`   📋 Atributos encontrados: ${attributes.attributes.length}`);
          if (attributes.attributes.length > 0) {
            attributes.attributes.forEach((attr: any) => {
              console.log(`      - ${attr.key} (${attr.type})`);
            });
          } else {
            console.log('   ⚠️  No hay atributos definidos. Necesitas ejecutar setupCollections.ts');
          }
        } catch (error: any) {
          console.log(`   ⚠️  No se pudieron listar atributos: ${error.message}`);
        }
      } catch (error: any) {
        console.log(`   ❌ Collection no encontrada: ${error.message}`);
        console.log(`   💡 Verifica que el Collection ID sea correcto`);
      }
    }
    
    console.log('\n✅ Verificación completada');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Si no hay collections, créalas en Appwrite Console');
    console.log('   2. Si las collections no tienen atributos, ejecuta: npx tsx scripts/setupCollections.ts');
    console.log('   3. Si estás usando Tables en lugar de Collections, necesitas migrar a Collections');
    
  } catch (error: any) {
    console.error('\n❌ Error durante la verificación:', error.message || error);
    if (error.code === 401 || error.code === 403) {
      console.error('\n💡 Verifica que tu API Key tenga permisos de administrador');
    }
    process.exit(1);
  }
}

checkAPI();

