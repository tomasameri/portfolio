'use client';

import { useState, useEffect } from 'react';
import { Project, getProjects } from '@/lib/services/projectsService';
import ProjectModal from '@/components/ProjectModal';
import { useLocale } from '@/context/LocaleContext';
import Image from 'next/image';

export default function ProjectsPage() {
  const { messages } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">{messages.projects.title}</h1>
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          {messages.projects.loading}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">{messages.projects.title}</h1>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="border border-dust-grey/30 dark:border-pale-sky/10 rounded-lg overflow-hidden bg-white dark:bg-gunmetal/50 hover:shadow-lg hover:border-cool-sky/30 dark:hover:border-cool-sky/20 transition-all cursor-pointer group"
              >
                {project.image && (
                  <div className="relative w-full h-48 overflow-hidden bg-dust-grey/20 dark:bg-pale-sky/10">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold text-gunmetal dark:text-alice-blue">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                  <p className="text-gunmetal/70 dark:text-pale-sky/80 mb-4">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded bg-cool-sky/20 dark:bg-cool-sky/10 text-cool-sky"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded bg-dust-grey/20 dark:bg-pale-sky/10 text-gunmetal/60 dark:text-pale-sky/60">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                    <div className="text-sm text-cool-sky font-medium">
                      {messages.projects.viewMore} →
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
            <p>{messages.projects.noProjects}</p>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </>
  );
}

