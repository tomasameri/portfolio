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

// Importar Appwrite SDK directamente
import { Client, Databases, Account, ID } from 'appwrite';

// Crear cliente de Appwrite específico para este script
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID!;
const apiKey = process.env.APPWRITE_API_KEY;

// Crear cliente con API key para operaciones administrativas
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

if (apiKey) {
  // Si hay API key, usarla para operaciones administrativas
  client.setDevKey(apiKey);
} else {
  console.warn('⚠️  No se encontró APPWRITE_API_KEY. El script intentará usar autenticación de usuario.');
}

const databases = new Databases(client);
const account = new Account(client);

// Interfaces necesarias
interface BlogPostDocument {
  $id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Función para obtener todos los posts
async function getAllPosts(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    );

    const posts = response.documents as unknown as BlogPostDocument[];
    posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return posts.map(post => ({
      id: post.$id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Función para crear un post
async function createPost(
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  authorId: string,
  published: boolean = false
): Promise<any> {
  const postData: Partial<BlogPostDocument> = {
    title,
    slug,
    excerpt,
    content,
    published,
    authorId,
    publishedAt: published ? new Date().toISOString() : undefined,
  };

  const response = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    postData as any
  );

  const post = response as unknown as BlogPostDocument;
  return {
    id: post.$id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    published: post.published,
    publishedAt: post.publishedAt,
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

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
    let authorId: string;

    // Si hay API key, usar un ID de autor por defecto o el que se especifique
    if (apiKey) {
      // Con API key, podemos usar un ID de autor por defecto
      // O puedes especificar un authorId en las variables de entorno
      authorId = process.env.APPWRITE_AUTHOR_ID || 'default-author';
      console.log(`✓ Usando API Key para operaciones administrativas`);
      console.log(`  Author ID: ${authorId}`);
    } else {
      // Sin API key, necesitamos autenticación de usuario
      console.log('Verificando autenticación...');
      try {
        const user = await account.get();
        authorId = user.$id;
        console.log(`✓ Autenticado como: ${user.email}`);
      } catch (error: any) {
        console.error('❌ Error de autenticación:', error.message);
        console.error('\n💡 Opciones:');
        console.error('   1. Agrega APPWRITE_API_KEY a tu .env.local para usar operaciones administrativas');
        console.error('   2. O inicia sesión primero usando el panel admin y ejecuta este script');
        process.exit(1);
      }
    }

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
        authorId,
        post.published
      );
      console.log(`✓ Post ${i + 1}/${examplePosts.length} creado: ${post.title}`);
    }

    console.log('\n✅ Migración completada exitosamente!');
  } catch (error: any) {
    console.error('❌ Error durante la migración:', error.message || error);
    if (error.code === 401 || error.code === 403) {
      console.error('\n💡 El error de autenticación puede significar que:');
      console.error('   1. La API Key no tiene permisos de administrador');
      console.error('   2. La API Key es incorrecta');
      console.error('   3. No hay sesión de usuario activa (si no usas API Key)');
    }
    process.exit(1);
  }
}

migrateBlogPosts();

