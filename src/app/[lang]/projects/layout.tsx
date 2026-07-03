import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { projectsItemListSchema } from '@/lib/schema';
import { getProjects, type Project } from '@/lib/services/projectsService';

// Regeneramos el schema de proyectos cada hora (los datos viven en Appwrite).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Proyectos de Tomas Ameri: marketplaces, automatización y productos con inteligencia artificial aplicada.',
  openGraph: {
    title: 'Projects',
    description:
      'Proyectos de Tomas Ameri: marketplaces, automatización y productos con inteligencia artificial aplicada.',
    type: 'website',
  },
};

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
