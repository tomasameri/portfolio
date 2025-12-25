/**
 * Script de migración para crear posts de ejemplo en Appwrite
 * 
 * Ejecutar con: npx tsx scripts/migrateBlogPosts.ts
 * 
 * Asegúrate de tener las variables de entorno configuradas y estar autenticado antes de ejecutar.
 */

// Cargar variables de entorno desde .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Verificar que las variables críticas estén configuradas
const requiredVars = [
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPor favor, configura estas variables en tu archivo .env.local');
  process.exit(1);
}

console.log('✓ Variables de entorno cargadas correctamente\n');

import { createPost, getAllPosts } from '../src/lib/services/blogService';
import { account } from '../src/lib/appwrite';

const examplePosts = [
  {
    title: 'Primer artículo del blog',
    slug: 'primer-articulo-del-blog',
    excerpt: 'Un resumen corto del primer artículo del blog...',
    content: `# Primer artículo del blog

Este es el contenido del primer artículo del blog.

Puedes escribir en **markdown** y usar todas las características que soporta.

## Subtítulo

- Lista item 1
- Lista item 2
- Lista item 3

¡Disfruta escribiendo!`,
    published: false,
  },
  {
    title: 'Segundo artículo del blog',
    slug: 'segundo-articulo-del-blog',
    excerpt: 'Un resumen corto del segundo artículo del blog...',
    content: `# Segundo artículo del blog

Este es el contenido del segundo artículo.

Puedes usar código:

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

Y mucho más contenido en markdown.`,
    published: false,
  },
];

async function migrateBlogPosts() {
  try {
    // Verificar autenticación
    console.log('Verificando autenticación...');
    const user = await account.get();
    console.log(`✓ Autenticado como: ${user.email}`);

    console.log('Verificando posts existentes...');
    const existingPosts = await getAllPosts();

    if (existingPosts.length > 0) {
      console.log(`Ya existen ${existingPosts.length} posts en la base de datos.`);
      console.log('Si deseas migrar de nuevo, elimina los posts existentes primero.');
      return;
    }

    console.log('Migrando posts a Appwrite...');
    for (let i = 0; i < examplePosts.length; i++) {
      const post = examplePosts[i];
      await createPost(
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        user.$id,
        post.published
      );
      console.log(`✓ Post ${i + 1}/${examplePosts.length} creado: ${post.title}`);
    }

    console.log('\n✅ Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    if (error instanceof Error && error.message.includes('session')) {
      console.error('Por favor, inicia sesión primero usando el panel admin.');
    }
    process.exit(1);
  }
}

migrateBlogPosts();

