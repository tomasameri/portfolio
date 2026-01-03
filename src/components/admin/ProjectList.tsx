'use client';

import { useState, useEffect } from 'react';
import { Project, getAllProjects, deleteProject, updateProject, createProject } from '@/lib/services/projectsService';
import ProjectForm from './ProjectForm';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSave = async (data: {
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
  }) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(
          data.title,
          data.slug,
          data.description,
          data.longDescription,
          data.technologies,
          data.image,
          data.url,
          data.githubUrl,
          data.featured,
          data.order
        );
      }
      await loadProjects();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) {
      return;
    }
    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateProject(project.id, { featured: !project.featured });
      await loadProjects();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Error al cambiar estado destacado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gunmetal dark:text-pale-sky">Cargando proyectos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gunmetal dark:text-alice-blue">
          Gestionar Proyectos
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors"
        >
          + Nuevo Proyecto
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 bg-alice-blue dark:bg-pale-sky/10 rounded-xl border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gunmetal dark:text-alice-blue">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                      ⭐ Destacado
                    </span>
                  )}
                  <span className="text-sm text-gunmetal/50 dark:text-pale-sky/60">
                    Orden: {project.order}
                  </span>
                </div>
                <p className="text-gunmetal/70 dark:text-pale-sky/80 mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded bg-cool-sky/20 dark:bg-cool-sky/10 text-cool-sky"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gunmetal/50 dark:text-pale-sky/60">
                  <span>Slug: {project.slug}</span>
                  {project.url && (
                    <span className="ml-4">
                      URL: <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-cool-sky hover:underline">{project.url}</a>
                    </span>
                  )}
                  {project.githubUrl && (
                    <span className="ml-4">
                      GitHub: <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-cool-sky hover:underline">{project.githubUrl}</a>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 bg-cool-sky text-gunmetal rounded hover:bg-cool-sky/90"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className={`p-2 rounded ${
                    project.featured
                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                  title={project.featured ? 'Quitar destacado' : 'Destacar'}
                >
                  {project.featured ? '⭐' : '☆'}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          No hay proyectos. Crea uno nuevo para comenzar.
        </div>
      )}

      <ProjectForm
        project={editingProject}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

