'use server';

import { createAdminClient } from '@/lib/server/appwrite';
import { Project, ProjectDocument, documentToProject } from '@/lib/services/projectsService';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const getDatabaseId = () => process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const getCollectionId = () => process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!;

export async function getProjectsAction(): Promise<Project[]> {
    const { databases } = createAdminClient();
    const databaseId = getDatabaseId();
    const collectionId = getCollectionId();

    try {
        const response = await databases.listDocuments(
            databaseId,
            collectionId,
            []
        );

        const projects = response.documents as unknown as ProjectDocument[];

        // Server-side sorting
        projects.sort((a, b) => {
            if (a.order !== b.order) {
                return (a.order || 0) - (b.order || 0);
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return projects.map(documentToProject);
    } catch (error: any) {
        console.error('Server Action Error fetching projects:', error);
        // Return empty array instead of throwing to avoid crashing UI if just one fetch fails
        return [];
    }
}

export async function getProjectBySlugAction(slug: string): Promise<Project | null> {
    const { databases } = createAdminClient();
    const databaseId = getDatabaseId();
    const collectionId = getCollectionId();

    try {
        const response = await databases.listDocuments(
            databaseId,
            collectionId,
            []
        );

        const projects = response.documents as unknown as ProjectDocument[];
        const project = projects.find(p => p.slug === slug);

        if (!project) return null;

        return documentToProject(project);
    } catch (error: any) {
        console.error('Server Action Error fetching project by slug:', error);
        return null;
    }
}


export async function createProjectAction(
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
    const { databases } = createAdminClient();
    const databaseId = getDatabaseId();
    const collectionId = getCollectionId();

    try {
        const projectData = {
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
            projectData
        );

        revalidatePath('/admin');
        revalidatePath('/');

        return documentToProject(response as unknown as ProjectDocument);
    } catch (error: any) {
        console.error('Server Action Error creating project:', error);
        throw new Error(error.message || 'Error creating project');
    }
}

export async function updateProjectAction(
    projectId: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Project> {
    const { databases } = createAdminClient();
    const databaseId = getDatabaseId();
    const collectionId = getCollectionId();

    try {
        const updateData: any = {};

        // Copy fields
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.slug !== undefined) updateData.slug = updates.slug;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.longDescription !== undefined) updateData.longDescription = updates.longDescription;
        if (updates.image !== undefined) updateData.image = updates.image;
        if (updates.url !== undefined) updateData.url = updates.url;
        if (updates.githubUrl !== undefined) updateData.githubUrl = updates.githubUrl;
        if (updates.featured !== undefined) updateData.featured = updates.featured;
        if (updates.order !== undefined) updateData.order = updates.order;

        if (updates.technologies !== undefined) {
            updateData.technologies = Array.isArray(updates.technologies)
                ? JSON.stringify(updates.technologies)
                : updates.technologies;
        }

        const response = await databases.updateDocument(
            databaseId,
            collectionId,
            projectId,
            updateData
        );

        revalidatePath('/admin');
        revalidatePath('/');

        return documentToProject(response as unknown as ProjectDocument);
    } catch (error: any) {
        console.error('Server Action Error updating project:', error);
        throw new Error(error.message || 'Error updating project');
    }
}

export async function deleteProjectAction(projectId: string): Promise<void> {
    const { databases } = createAdminClient();
    const databaseId = getDatabaseId();
    const collectionId = getCollectionId();

    try {
        await databases.deleteDocument(
            databaseId,
            collectionId,
            projectId
        );

        revalidatePath('/admin');
        revalidatePath('/');
    } catch (error: any) {
        console.error('Server Action Error deleting project:', error);
        throw new Error(error.message || 'Error deleting project');
    }
}
