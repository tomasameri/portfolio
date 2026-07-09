import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { projectsItemListSchema } from '@/lib/schema';
import { getProjects, type Project } from '@/lib/services/projectsService';
import { pageMetadata } from '@/lib/seo';

// Regeneramos el schema de proyectos cada hora (los datos viven en Appwrite).
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, '/projects', {
    en: {
      title: 'Projects',
      description:
        'Selected products and experiments by Tomás Ameri — marketplaces, automation, and applied artificial intelligence.',
    },
    es: {
      title: 'Proyectos',
      description:
        'Proyectos de Tomás Ameri: marketplaces, automatización y productos con inteligencia artificial aplicada.',
    },
  });
}

export default async function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let projects: Project[] = [];
  try {
    projects = await getProjects();
  } catch {
    // Si Appwrite no responde, seguimos sin el schema (no rompemos la página).
  }

  return (
    <>
      {projects.length > 0 && (
        <JsonLd data={projectsItemListSchema(projects, lang)} />
      )}
      {children}
    </>
  );
}
