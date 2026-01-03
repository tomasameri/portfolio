'use client';

import { Project } from '@/lib/services/projectsService';
import { useLocale } from '@/context/LocaleContext';
import Image from 'next/image';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { messages } = useLocale();
  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 bg-gunmetal/90 dark:bg-gunmetal/95 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gunmetal rounded-xl shadow-xl max-w-4xl w-full my-8 border border-dust-grey/30 dark:border-pale-sky/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dust-grey/30 dark:border-pale-sky/20">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gunmetal dark:text-alice-blue">
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gunmetal/70 dark:text-pale-sky/70 hover:text-gunmetal dark:hover:text-pale-sky text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {project.image && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-dust-grey/20 dark:bg-pale-sky/10">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-lg text-gunmetal dark:text-pale-sky leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.longDescription && (
            <div>
              <h3 className="text-xl font-semibold text-gunmetal dark:text-alice-blue mb-3">
                {messages.projects.aboutProject}
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gunmetal/80 dark:text-pale-sky/80 whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gunmetal dark:text-alice-blue mb-3">
                {messages.projects.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cool-sky/20 dark:bg-cool-sky/10 text-cool-sky rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-dust-grey/30 dark:border-pale-sky/20">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-cool-sky text-gunmetal rounded-lg hover:bg-cool-sky/90 transition-colors font-medium"
              >
                {messages.projects.viewProject}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-dust-grey/30 dark:border-pale-sky/20 text-gunmetal dark:text-pale-sky rounded-lg hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-colors font-medium"
              >
                {messages.projects.viewGithub}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

