import { databases, getDatabaseId, getBlogCollectionId, ID } from '../appwrite';

export interface BlogPost {
  id: string;
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

export interface BlogPostDocument {
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

// Convertir documento de Appwrite a BlogPost
function documentToPost(doc: BlogPostDocument): BlogPost {
  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    published: doc.published,
    publishedAt: doc.publishedAt,
    authorId: doc.authorId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Obtener todos los posts publicados
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        // Filtrar solo posts publicados
        // Ordenar por fecha de publicación descendente
      ]
    );

    const posts = response.documents as unknown as BlogPostDocument[];
    // Filtrar posts publicados y ordenar por fecha
    const publishedPosts = posts
      .filter(post => post.published)
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

    return publishedPosts.map(documentToPost);
  } catch (error: any) {
    console.error('Error fetching published posts:', error);
    // Si es un error de configuración, retornar array vacío
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      console.warn('Appwrite not configured or route not found. Returning empty array.');
      return [];
    }
    throw error;
  }
}

// Obtener todos los posts (incluyendo no publicados) - para admin
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    );

    const posts = response.documents as unknown as BlogPostDocument[];
    // Ordenar por fecha de creación descendente
    posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return posts.map(documentToPost);
  } catch (error: any) {
    console.error('Error fetching all posts:', error);
    // Si es un error de configuración, retornar array vacío
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      console.warn('Appwrite not configured or route not found. Returning empty array.');
      return [];
    }
    throw error;
  }
}

// Obtener post por slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      return null;
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        // Filtrar por slug
      ]
    );

    const posts = response.documents as unknown as BlogPostDocument[];
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return null;
    }

    // Solo retornar si está publicado o si es el autor
    if (!post.published) {
      // Aquí podrías verificar si el usuario actual es el autor
      // Por ahora, retornamos null si no está publicado
      return null;
    }

    return documentToPost(post);
  } catch (error: any) {
    console.error('Error fetching post by slug:', error);
    // Si es un error de configuración, retornar null
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      console.warn('Appwrite not configured or route not found. Returning null.');
      return null;
    }
    throw error;
  }
}

// Crear nuevo post
export async function createPost(
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  authorId: string,
  published: boolean = false
): Promise<BlogPost> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

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

    return documentToPost(response as unknown as BlogPostDocument);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Actualizar post
export async function updatePost(
  postId: string,
  updates: Partial<Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'content' | 'published'>>
): Promise<BlogPost> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    const updateData: Partial<BlogPostDocument> = { ...updates };
    
    // Si se está publicando, actualizar publishedAt
    if (updates.published === true) {
      updateData.publishedAt = new Date().toISOString();
    }

    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      postId,
      updateData as any
    );

    return documentToPost(response as unknown as BlogPostDocument);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Eliminar post
export async function deletePost(postId: string): Promise<void> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getBlogCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    await databases.deleteDocument(
      databaseId,
      collectionId,
      postId
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

