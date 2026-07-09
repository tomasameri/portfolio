import { getProjects } from '@/lib/services/projectsService';
import ProjectsClient from './ProjectsClient';

// Renderizado en servidor con ISR: los proyectos viajan en el HTML inicial
// (indexables por Google). Se refresca cada hora, igual que el schema del layout.
export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient projects={projects} />;
}
