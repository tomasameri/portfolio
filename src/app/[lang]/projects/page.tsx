'use client';

import { useState, useEffect } from 'react';
import { Project, getProjects } from '@/lib/services/projectsService';
import ProjectModal from '@/components/ProjectModal';
import { useLocale } from '@/context/LocaleContext';
import Image from 'next/image';
import EditorialTitle from '@/components/ui/EditorialTitle';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

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
      <div className="container mx-auto px-6 py-24 max-w-7xl">
        <EditorialTitle level="display-md" as="h1" className="mb-12">{messages.projects.title}</EditorialTitle>
        <div className="text-center py-24 text-on-surface-muted font-body animate-pulse">
          {messages.projects.loading}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-6 py-24 max-w-7xl">
        <EditorialTitle level="display-md" as="h1" className="mb-12">{messages.projects.title}</EditorialTitle>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                interactive
                onClick={() => handleProjectClick(project)}
                className="group flex flex-col h-full ring-1 ring-on-surface-muted/5 hover:ring-accent/20"
              >
                {project.image && (
                  <div className="relative w-full h-56 overflow-hidden bg-surface-container flex-shrink-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <EditorialTitle level="headline-sm" as="h2">
                      {project.title}
                    </EditorialTitle>
                    {project.featured && (
                      <span className="text-yellow-500 text-lg" title="Featured">⭐</span>
                    )}
                  </div>
                  <p className="font-body text-on-surface-variant mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech, idx) => (
                        <Tag key={idx} variant="accent">{tech}</Tag>
                      ))}
                      {(project.technologies?.length ?? 0) > 3 && (
                        <Tag>+{(project.technologies?.length ?? 0) - 3}</Tag>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-sm font-label text-accent font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                      {messages.projects.viewMore} →
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-on-surface-muted font-body">
            <p className="text-lg">{messages.projects.noProjects}</p>
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

