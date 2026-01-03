import { databases, getDatabaseId, getProjectsCollectionId, ID } from '../appwrite';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies?: string[];
  image?: string;
  url?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  $id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies?: string;
  image?: string;
  url?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Convertir documento de Appwrite a Project
function documentToProject(doc: ProjectDocument): Project {
  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    longDescription: doc.longDescription,
    technologies: doc.technologies ? (typeof doc.technologies === 'string' ? JSON.parse(doc.technologies) : doc.technologies) : [],
    image: doc.image,
    url: doc.url,
    githubUrl: doc.githubUrl,
    featured: doc.featured || false,
    order: doc.order || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Helper function to check if error is an authorization error
function isAuthError(error: any): boolean {
  if (!error) return false;
  
  if (error.code === 401 || error.code === 403) {
    return true;
  }
  
  if (error.message) {
    const message = error.message.toLowerCase();
    return (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('not authorized') ||
      message.includes('missing scopes') ||
      message.includes('missing scope')
    );
  }
  
  return false;
}

// Obtener todos los proyectos (para landing)
export async function getProjects(): Promise<Project[]> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    );

    const projects = response.documents as unknown as ProjectDocument[];
    // Ordenar por order y luego por fecha de creación
    projects.sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 0) - (b.order || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return projects.map(documentToProject);
  } catch (error: any) {
    if (isAuthError(error)) {
      return [];
    }
    
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      return [];
    }
    
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Obtener proyecto por slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      return null;
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    );

    const projects = response.documents as unknown as ProjectDocument[];
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return null;
    }

    return documentToProject(project);
  } catch (error: any) {
    if (isAuthError(error)) {
      return null;
    }
    
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      return null;
    }
    
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

// Obtener todos los proyectos (para admin)
export async function getAllProjects(): Promise<Project[]> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    );

    const projects = response.documents as unknown as ProjectDocument[];
    projects.sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 0) - (b.order || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return projects.map(documentToProject);
  } catch (error: any) {
    console.error('Error fetching all projects:', error);
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      return [];
    }
    throw error;
  }
}

// Crear nuevo proyecto
export async function createProject(
  title: string,
  slug: string,
  description: string,
  longDescription?: string,
  technologies?: string[],
  image?: string,
  url?: string,
  githubUrl?: string,
  featured: boolean = false,
  order: number = 0
): Promise<Project> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    const projectData: Partial<ProjectDocument> = {
      title,
      slug,
      description,
      longDescription,
      technologies: technologies ? JSON.stringify(technologies) : undefined,
      image,
      url,
      githubUrl,
      featured,
      order,
    };

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      projectData as any
    );

    return documentToProject(response as unknown as ProjectDocument);
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error?.message?.includes('Unknown attribute')) {
      const attributeMatch = error.message.match(/Unknown attribute: "([^"]+)"/);
      const attribute = attributeMatch ? attributeMatch[1] : 'desconocido';
      throw new Error(
        `El atributo "${attribute}" no está definido en la colección de projects en Appwrite. ` +
        `Por favor, ve a Appwrite Console → Databases → Tu Base de Datos → Collections → projects → Attributes ` +
        `y crea el atributo "${attribute}".`
      );
    }
    
    throw error;
  }
}

// Actualizar proyecto
export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Project> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    const updateData: Partial<ProjectDocument> = {};
    
    // Copiar campos y convertir technologies a string si es array
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.longDescription !== undefined) updateData.longDescription = updates.longDescription;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.githubUrl !== undefined) updateData.githubUrl = updates.githubUrl;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.order !== undefined) updateData.order = updates.order;
    
    // Convertir technologies a string si es array
    if (updates.technologies !== undefined) {
      updateData.technologies = Array.isArray(updates.technologies) 
        ? JSON.stringify(updates.technologies) 
        : updates.technologies;
    }

    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      projectId,
      updateData as any
    );

    return documentToProject(response as unknown as ProjectDocument);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Eliminar proyecto
export async function deleteProject(projectId: string): Promise<void> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getProjectsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    await databases.deleteDocument(
      databaseId,
      collectionId,
      projectId
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

