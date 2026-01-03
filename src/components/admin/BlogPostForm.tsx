'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/lib/services/blogService';

// Importar el editor markdown de forma dinámica para evitar problemas de SSR
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface BlogPostFormProps {
  post?: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published: boolean;
  }) => Promise<void>;
}

export default function BlogPostForm({ post, isOpen, onClose, onSave }: BlogPostFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setPublished(post.published);
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setPublished(false);
    }
  }, [post, isOpen]);

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
    if (!post || slug === generateSlug(post.title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      alert('El slug es requerido');
      return;
    }
    setSaving(true);
    try {
      await onSave({ title, slug, excerpt, content, published });
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el post');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gunmetal/90 dark:bg-gunmetal/95 flex items-center justify-center z-50 p-4">
      <div className="bg-alice-blue dark:bg-pale-sky/10 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-dust-grey/30 dark:border-pale-sky/20">
        <div className="p-6 border-b border-dust-grey/30 dark:border-pale-sky/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gunmetal dark:text-alice-blue">
              {post ? 'Editar Post' : 'Nuevo Post'}
            </h2>
            <button
              onClick={onClose}
              className="text-gunmetal/70 dark:text-pale-sky/70 hover:text-gunmetal dark:hover:text-pale-sky"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                placeholder="Título del post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                placeholder="titulo-del-post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-1">
                Extracto
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={2}
                className="w-full px-4 py-2 rounded-md border border-dust-grey/40 dark:border-pale-sky/20 bg-white dark:bg-gunmetal text-gunmetal dark:text-pale-sky"
                placeholder="Breve descripción del post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gunmetal dark:text-pale-sky mb-2">
                Contenido (Markdown)
              </label>
              <div data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || '')}
                  preview="edit" // Modo split: editor + preview en tiempo real
                  hideToolbar={false}
                  visibleDragbar={true}
                  textareaProps={{
                    placeholder: 'Escribe tu contenido en Markdown...',
                    style: {
                      fontSize: 14,
                      minHeight: '400px',
                    },
                  }}
                  height={500}
                />
              </div>
              <p className="mt-2 text-xs text-gunmetal/60 dark:text-pale-sky/60">
                💡 Usa la barra de herramientas para formatear el texto. El preview se muestra en tiempo real.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="published" className="text-sm text-gunmetal dark:text-pale-sky">
                Publicar inmediatamente
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-dust-grey/30 dark:border-pale-sky/20 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gunmetal dark:text-pale-sky hover:bg-dust-grey/20 dark:hover:bg-pale-sky/10 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

