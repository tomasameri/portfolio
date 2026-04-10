'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/lib/services/blogService';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  EyeIcon, 
  PencilIcon, 
  TagIcon, 
  HashtagIcon, 
  PhotoIcon, 
  GlobeAltIcon, 
  RocketLaunchIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import MarkdownPreview from './MarkdownPreview';

// Importar el editor markdown de forma dinámica
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface BlogPostFormProps {
  post?: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>) => Promise<void>;
}

export default function BlogPostForm({ post, isOpen, onClose, onSave }: BlogPostFormProps) {
  // Core content
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  
  // Metadata & Editorial fields
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [readingTime, setReadingTime] = useState(0);

  // UI State
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'seo'>('content');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setExcerpt(post.excerpt || '');
      setContent(post.content || '');
      setPublished(post.published || false);
      setFeatured(post.featured || false);
      setNewsletter(post.newsletter || false);
      setCoverImage(post.coverImage || '');
      setTags(post.tags || []);
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setReadingTime(post.readingTime || 0);
    } else {
      resetForm();
    }
  }, [post, isOpen]);

  // Calculate reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200); // ~200 words per minute
    setReadingTime(time);
  }, [content]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setPublished(false);
    setFeatured(false);
    setNewsletter(false);
    setCoverImage('');
    setTags([]);
    setSeoTitle('');
    setSeoDescription('');
    setReadingTime(0);
  };

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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('El título y el slug son requeridos');
      return;
    }
    setSaving(true);
    try {
      await onSave({ 
        title, 
        slug, 
        excerpt, 
        content, 
        published,
        featured,
        newsletter,
        coverImage,
        tags,
        seoTitle,
        seoDescription,
        readingTime
      });
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
    <div className="fixed inset-0 bg-white dark:bg-gunmetal z-[100] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Editorial Header bar */}
      <header className="h-20 border-b border-dust-grey/20 dark:border-pale-sky/10 flex items-center justify-between px-8 shrink-0 bg-white/80 dark:bg-gunmetal/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gunmetal/60 dark:text-pale-sky/60" />
          </button>
          <div className="h-6 w-[1px] bg-dust-grey/20 dark:border-pale-sky/10 mx-2" />
          <h2 className="text-xl font-display font-semibold text-gunmetal dark:text-alice-blue truncate max-w-[300px]">
            {title || 'Nuevo Post'}
          </h2>
          {published && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
              Publicado
            </span>
          )}
        </div>

        {/* View Switchers */}
        <div className="flex items-center bg-dust-grey/10 dark:bg-pale-sky/5 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${viewMode === 'edit' ? 'bg-white dark:bg-gunmetal shadow-sm text-cool-sky' : 'text-gunmetal/40 dark:text-pale-sky/40 hover:text-gunmetal'}`}
          >
            <PencilIcon className="w-4 h-4" /> Escribir
          </button>
          <button 
            onClick={() => setViewMode('split')}
            className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${viewMode === 'split' ? 'bg-white dark:bg-gunmetal shadow-sm text-cool-sky' : 'text-gunmetal/40 dark:text-pale-sky/40 hover:text-gunmetal'}`}
          >
            <RocketLaunchIcon className="w-4 h-4" /> Dividir
          </button>
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-gunmetal shadow-sm text-cool-sky' : 'text-gunmetal/40 dark:text-pale-sky/40 hover:text-gunmetal'}`}
          >
            <EyeIcon className="w-4 h-4" /> Previa
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
             <span className="text-[10px] uppercase tracking-widest text-gunmetal/40 dark:text-pale-sky/40 font-bold">Tiempo lectura</span>
             <span className="text-xs font-semibold text-gunmetal/80 dark:text-pale-sky/80">{readingTime} min</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-cool-sky hover:bg-cool-sky/90 text-gunmetal px-8 py-3 rounded-2xl font-bold shadow-lg shadow-cool-sky/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : published ? 'Actualizar' : 'Guardar borrador'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Main Area (Left/Center) */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${activeTab !== 'content' ? 'hidden sm:block' : ''}`}>
           <div className={`mx-auto max-w-6xl p-8 lg:p-12 transition-all h-full ${viewMode === 'split' ? 'grid grid-cols-2 gap-12' : ''}`}>
              
              {/* Write Mode */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className="flex flex-col h-full space-y-8 animate-in slide-in-from-left-4 fade-in">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título del post..."
                    className="text-5xl font-display font-bold bg-transparent border-none outline-none text-gunmetal dark:text-alice-blue placeholder:text-gunmetal/10 dark:placeholder:text-pale-sky/10 p-0 focus:ring-0"
                  />
                  
                  <div className="flex-1 min-h-[500px]" data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                    <MDEditor
                      value={content}
                      onChange={(value) => setContent(value || '')}
                      preview="edit"
                      hideToolbar={false}
                      visibleDragbar={false}
                      height="100%"
                      className="!border-none !bg-transparent !shadow-none"
                    />
                  </div>
                </div>
              )}

              {/* Preview Mode */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="h-full overflow-y-auto animate-in slide-in-from-right-4 fade-in">
                   <div className="mb-8">
                     <h1 className="text-5xl font-display font-bold text-gunmetal dark:text-alice-blue mb-4 leading-tight">{title || 'Sin Título'}</h1>
                     <div className="flex items-center gap-4 text-sm text-gunmetal/40 dark:text-pale-sky/40">
                       <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {readingTime} min lectura</span>
                       <span className="flex items-center gap-1 uppercase tracking-wider font-bold">{published ? 'Publicado' : 'Borrador'}</span>
                     </div>
                   </div>
                   <MarkdownPreview content={content} />
                </div>
              )}
           </div>
        </div>

        {/* Sidebar (Right) */}
        <aside className="w-80 border-l border-dust-grey/20 dark:border-pale-sky/10 bg-alice-blue/30 dark:bg-gunmetal/20 shrink-0 overflow-y-auto p-6 space-y-8 hidden xl:block">
            {/* Status Section */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <HashtagIcon className="w-3 h-3" /> Estado y Visibilidad
              </h3>
              <div className="bg-white dark:bg-gunmetal/50 rounded-2xl p-4 border border-dust-grey/20 dark:border-pale-sky/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="published-toggle" className="text-sm font-semibold text-gunmetal/80 dark:text-pale-sky/80 cursor-pointer">Publicado</label>
                  <input
                    id="published-toggle"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 accent-cool-sky rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="featured-toggle" className="text-sm font-semibold text-gunmetal/80 dark:text-pale-sky/80 cursor-pointer">Destacado</label>
                  <input
                    id="featured-toggle"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 accent-cool-sky rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="newsletter-toggle" className="flex items-center gap-1.5 text-sm font-semibold text-gunmetal/80 dark:text-pale-sky/80 cursor-pointer">
                    <EnvelopeIcon className="w-4 h-4 text-cool-sky/70" />
                    Newsletter
                  </label>
                  <input
                    id="newsletter-toggle"
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-5 h-5 accent-cool-sky rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </section>

            {/* URL & Meta */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <GlobeAltIcon className="w-3 h-3" /> URL Permanente
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30 text-cool-sky font-mono"
                  placeholder="slug-del-post"
                />
              </div>
            </section>

            {/* Cover Image */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <PhotoIcon className="w-3 h-3" /> Imagen de Portada
              </h3>
              <div className="group relative aspect-video rounded-2xl border-2 border-dashed border-dust-grey/30 dark:border-pale-sky/20 overflow-hidden bg-white/5 dark:bg-gunmetal/20 flex items-center justify-center transition-all hover:border-cool-sky/50">
                {coverImage ? (
                  <>
                    <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setCoverImage('')} className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20">Remover</button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <PhotoIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] opacity-40">Pega la URL de una imagen</p>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30"
                placeholder="https://images.unsplash.com/..."
              />
            </section>

            {/* Tags */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <TagIcon className="w-3 h-3" /> Etiquetas
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30"
                  placeholder="Añadir etiqueta y Enter..."
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="px-2 py-1 bg-cool-sky/10 text-cool-sky text-[10px] font-bold rounded-lg border border-cool-sky/20 flex items-center gap-1">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-red-500">✕</button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* SEO Tool */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <DocumentTextIcon className="w-3 h-3" /> SEO & Social
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold opacity-50 uppercase">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold opacity-50 uppercase">SEO Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30 resize-none"
                  />
                </div>
              </div>
            </section>
        </aside>

        {/* Floating Mobile Bottom Nav (Optional) */}
        <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-gunmetal/80 backdrop-blur-xl border border-dust-grey/20 dark:border-pale-sky/10 px-6 py-3 rounded-3xl shadow-2xl flex gap-8 z-50">
           <button onClick={() => setActiveTab('content')} className={`p-2 ${activeTab === 'content' ? 'text-cool-sky' : 'text-gunmetal/40'}`}><PencilIcon className="w-6 h-6" /></button>
           <button onClick={() => setActiveTab('metadata')} className={`p-2 ${activeTab === 'metadata' ? 'text-cool-sky' : 'text-gunmetal/40'}`}><TagIcon className="w-6 h-6" /></button>
           <button onClick={() => setActiveTab('seo')} className={`p-2 ${activeTab === 'seo' ? 'text-cool-sky' : 'text-gunmetal/40'}`}><GlobeAltIcon className="w-6 h-6" /></button>
        </div>
      </main>
    </div>
  );
}

