'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/services/projectsService';

interface ProjectFormProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
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
  }) => Promise<void>;
}

export default function ProjectForm({ project, isOpen, onClose, onSave }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [technologyInput, setTechnologyInput] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setSlug(project.slug);
      setDescription(project.description);
      setLongDescription(project.longDescription || '');
      setTechnologies(project.technologies || []);
      setImage(project.image || '');
      setUrl(project.url || '');
      setGithubUrl(project.githubUrl || '');
      setFeatured(project.featured || false);
      setOrder(project.order || 0);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setLongDescription('');
      setTechnologies([]);
      setTechnologyInput('');
      setImage('');
      setUrl('');
      setGithubUrl('');
      setFeatured(false);
      setOrder(0);
    }
  }, [project, isOpen]);

  // Generar slug automáticamente desde el título
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!project || slug === generateSlug(project.title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleAddTechnology = () => {
    if (technologyInput.trim() && !technologies.includes(technologyInput.trim())) {
      setTechnologies([...technologies, technologyInput.trim()]);
      setTechnologyInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      alert('El slug es requerido');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title,
        slug,
        description,
        longDescription: longDescription || undefined,
        technologies: technologies.length > 0 ? technologies : undefined,
        image: image || undefined,
        url: url || undefined,
        githubUrl: githubUrl || undefined,
        featured,
        order,
      });
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gunmetal/90 dark:bg-gunmetal/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-alice-blue dark:bg-pale-sky/10 rounded-xl shadow-xl max-w-4xl w-full my-8 border border-dust-grey/30 dark:border-pale-sky/20">
        <div className="p-6 border-b border-dust-grey/30 dark:border-pale-sky/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gunmetal dark:text-alice-blue">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gunmetal/70 dark:text-pale-sky/70 hover:text-gunmetal dark:hover:text-pale-sky text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              required
            />
            <p className="text-xs text-gunmetal/50 dark:text-pale-sky/60 mt-1">
              URL amigable para el proyecto (ej: mi-proyecto-awesome)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              Descripción breve *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              Descripción larga
            </label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              placeholder="Descripción detallada del proyecto, tecnologías utilizadas, desafíos enfrentados, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              Tecnologías
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
                placeholder="Ej: React, TypeScript, Node.js"
                className="flex-1 px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="px-4 py-2 bg-cool-sky text-gunmetal rounded-lg hover:bg-cool-sky/90"
              >
                Agregar
              </button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cool-sky/20 dark:bg-cool-sky/10 text-cool-sky rounded-full text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="hover:text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              URL del proyecto
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              URL de GitHub
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/usuario/repo"
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
              URL de imagen
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
            />
            {image && (
              <div className="mt-2">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded-lg border border-dust-grey/30 dark:border-pale-sky/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
                Orden
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 bg-white dark:bg-gunmetal/50 text-gunmetal dark:text-pale-sky"
              />
              <p className="text-xs text-gunmetal/50 dark:text-pale-sky/60 mt-1">
                Número para ordenar proyectos (menor = primero)
              </p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-dust-grey/30 dark:border-pale-sky/20 text-cool-sky"
                />
                <span className="text-sm font-medium text-gunmetal dark:text-pale-sky">
                  Proyecto destacado
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dust-grey/30 dark:border-pale-sky/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-dust-grey/30 dark:border-pale-sky/20 rounded-lg text-gunmetal dark:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-cool-sky text-gunmetal rounded-lg hover:bg-cool-sky/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

