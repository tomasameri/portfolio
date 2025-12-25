/**
 * Script de migración para mover las cards hardcodeadas a Appwrite
 * 
 * Ejecutar con: npx tsx scripts/migrateCards.ts
 * 
 * Asegúrate de tener las variables de entorno configuradas antes de ejecutar.
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
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPor favor, configura estas variables en tu archivo .env.local');
  process.exit(1);
}

console.log('✓ Variables de entorno cargadas correctamente');
console.log(`  Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
console.log(`  Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.substring(0, 8)}...`);
console.log(`  Database ID: ${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID?.substring(0, 8)}...`);
console.log(`  Collection ID: ${process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID}\n`);

// Ahora importar los servicios después de cargar las variables
import { getCards, createCard } from '../src/lib/services/cardsService';

const defaultCards = [
  {
    type: 'social' as const,
    size: 'small' as const,
    title: 'My Github',
    description: 'Check out my code and projects',
    url: 'https://github.com/tomasameri',
    socialPlatform: 'github' as const,
  },
  {
    type: 'social' as const,
    size: 'small' as const,
    title: "Let's Connect",
    description: 'linkedin.com/in/tomasameri',
    url: 'https://linkedin.com/in/tomasameri',
    socialPlatform: 'linkedin' as const,
  },
  {
    type: 'social' as const,
    size: 'small' as const,
    title: 'Twitter',
    description: '@toto_visiora | CTO & Co-Founder @Visiora_ai | 22 | BA | Exploring AI, Tech & Design',
    url: 'https://twitter.com/toto_visiora',
    socialPlatform: 'twitter' as const,
  },
  {
    type: 'social' as const,
    size: 'small' as const,
    title: 'TikTok (Personal)',
    description: '@tomiameri',
    url: 'https://tiktok.com/@tomiameri',
    socialPlatform: 'tiktok' as const,
  },
  {
    type: 'social' as const,
    size: 'small' as const,
    title: 'Instagram (Personal)',
    description: '@tomiameri',
    url: 'https://instagram.com/tomiameri',
    socialPlatform: 'instagram' as const,
  },
  {
    type: 'youtube' as const,
    size: 'small' as const,
    title: 'Tomi (Tech content & More)',
    description: 'Tech content, tutorials and more',
    url: 'https://youtube.com/@tomiameri',
    socialPlatform: 'youtube' as const,
  },
  {
    type: 'youtube' as const,
    size: 'large' as const,
    title: 'Toto (Just me playing some music)',
    description: 'Music sessions and covers',
    url: 'https://youtube.com/@totoameri',
    socialPlatform: 'youtube' as const,
  },
];

async function migrateCards() {
  try {
    console.log('Verificando cards existentes...');
    const existingCards = await getCards();

    if (existingCards.length > 0) {
      console.log(`Ya existen ${existingCards.length} cards en la base de datos.`);
      console.log('Si deseas migrar de nuevo, elimina las cards existentes primero.');
      return;
    }

    console.log('Migrando cards a Appwrite...');
    let successCount = 0;
    for (let i = 0; i < defaultCards.length; i++) {
      const card = defaultCards[i];
      try {
        await createCard(card, i);
        console.log(`✓ Card ${i + 1}/${defaultCards.length} creada: ${card.title}`);
        successCount++;
      } catch (error: any) {
        console.error(`✗ Error creando card "${card.title}":`, error.message || error);
        if (error.code === 404 || error.message?.includes('Route not found')) {
          console.error('\n   ⚠️  Esto puede significar que:');
          console.error('   1. La collection no existe en Appwrite');
          console.error('   2. El Database ID o Collection ID es incorrecto');
          console.error('      (Asegúrate de usar el ID completo de la collection, no solo el nombre)');
          console.error('   3. El endpoint de Appwrite no es correcto');
          console.error(`\n   Valores actuales:`);
          console.error(`   - Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
          console.error(`   - Database ID: ${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`);
          console.error(`   - Collection ID: ${process.env.NEXT_PUBLIC_APPWRITE_CARDS_COLLECTION_ID}`);
          console.error(`\n   💡 Tip: En Appwrite, ve a tu collection y copia el ID completo (no el nombre)`);
        }
        // Continuar con las siguientes cards en lugar de fallar completamente
      }
    }
    
    if (successCount === 0) {
      throw new Error('No se pudo crear ninguna card. Verifica la configuración de Appwrite.');
    }
    
    console.log(`\n✅ Migración completada: ${successCount}/${defaultCards.length} cards creadas exitosamente`);

    console.log('\n✅ Migración completada exitosamente!');
  } catch (error: any) {
    console.error('\n❌ Error durante la migración:', error.message || error);
    if (error.code === 404) {
      console.error('\n💡 Sugerencias:');
      console.error('   1. Verifica que la collection "cards" existe en tu base de datos de Appwrite');
      console.error('   2. Asegúrate de usar el ID completo de la collection, no solo el nombre');
      console.error('   3. Verifica que el endpoint de Appwrite sea correcto');
      console.error('   4. Verifica que el Project ID sea correcto');
    }
    process.exit(1);
  }
}

migrateCards();

