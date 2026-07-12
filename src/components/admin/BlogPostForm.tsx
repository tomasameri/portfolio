'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BlogPost } from '@/lib/services/blogService';
import {
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
  EnvelopeIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import rehypeRaw from 'rehype-raw';
import MarkdownPreview from './MarkdownPreview';
import { account } from '@/lib/appwrite';

// Importar el editor markdown de forma dinámica
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

import { commands } from '@uiw/react-md-editor';

// Límites recomendados por Google para no truncar en resultados de búsqueda.
const SEO_TITLE_MAX = 60;
const SEO_DESC_MIN = 120;
const SEO_DESC_MAX = 160;
const EXCERPT_MAX = 300;

interface BlogPostFormProps {
  post?: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>>) => Promise<void>;
  // Vocabulario de conceptos ya usados en otros posts, para que la IA reutilice
  // términos existentes (no fragmentar el grafo) y para autocompletar a mano.
  existingConcepts?: string[];
}

// Contador de caracteres con feedback de color según el rango ideal para SEO.
function CharMeter({
  value,
  ideal,
  max,
  min,
}: {
  value: number;
  ideal?: number;
  max: number;
  min?: number;
}) {
  let color = 'text-gunmetal/40 dark:text-pale-sky/40';
  if (value > max) color = 'text-red-500';
  else if (min !== undefined && value > 0 && value < min) color = 'text-amber-500';
  else if (value > 0) color = 'text-green-500';
  return (
    <span className={`text-[9px] font-mono font-bold ${color}`}>
      {value}
      {ideal ? `/${ideal}` : ''}
    </span>
  );
}

// Conversión ISO <-> valor de <input type="datetime-local"> respetando la zona local.
function toLocalInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function fromLocalInput(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

export default function BlogPostForm({ post, isOpen, onClose, onSave, existingConcepts = [] }: BlogPostFormProps) {
  // Core content
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  // Metadata & Editorial fields
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [noindex, setNoindex] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [concepts, setConcepts] = useState<string[]>([]);
  const [conceptInput, setConceptInput] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const [suggestNote, setSuggestNote] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [readingTime, setReadingTime] = useState(0);

  // UI State
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setExcerpt(post.excerpt || '');
      setContent(post.content || '');
      setPublished(post.published || false);
      setFeatured(post.featured || false);
      setNewsletter(post.newsletter || false);
      setNoindex(post.noindex || false);
      setCoverImage(post.coverImage || '');
      setCoverImageAlt(post.coverImageAlt || '');
      setPublishedAt(post.publishedAt || '');
      setTags(post.tags || []);
      setConcepts(post.concepts || []);
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setReadingTime(post.readingTime || 0);
    } else {
      resetForm();
    }
  }, [post, isOpen]);

  // Calculate reading time
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
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
    setNoindex(false);
    setCoverImage('');
    setCoverImageAlt('');
    setPublishedAt('');
    setTags([]);
    setConcepts([]);
    setConceptInput('');
    setSuggestNote('');
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

  const addConcept = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    // Deduplicamos sin distinguir mayúsculas/acentos para no ensuciar el grafo.
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!concepts.some(c => norm(c) === norm(clean))) {
      setConcepts([...concepts, clean]);
    }
  };

  const handleAddConcept = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && conceptInput.trim()) {
      e.preventDefault();
      addConcept(conceptInput);
      setConceptInput('');
    }
  };

  const removeConcept = (conceptToRemove: string) => {
    setConcepts(concepts.filter(c => c !== conceptToRemove));
  };

  // Genera el embedding semántico del post (vía Gemini) y lo devuelve serializado.
  // No bloquea el guardado: si algo falla, devuelve undefined y se guarda sin embedding.
  const computeEmbedding = async (): Promise<string | undefined> => {
    try {
      // Texto representativo: título + conceptos (peso alto) + resumen + inicio del contenido.
      const text = [
        title,
        concepts.length ? `Conceptos: ${concepts.join(', ')}` : '',
        excerpt,
        content.slice(0, 4000),
      ]
        .filter(Boolean)
        .join('\n\n')
        .trim();
      if (text.length < 5) return undefined;

      const { jwt } = await account.createJWT();
      const res = await fetch('/api/blog/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.embedding)) return undefined;
      return JSON.stringify(data.embedding);
    } catch (error) {
      console.error('Error computing embedding:', error);
      return undefined;
    }
  };

  // Llama al endpoint de IA/heurística y fusiona lo sugerido con lo que ya haya.
  const handleSuggestConcepts = async () => {
    if (!content.trim() && !title.trim()) {
      setSuggestNote('Escribí algo de contenido primero.');
      return;
    }
    setSuggesting(true);
    setSuggestNote('');
    try {
      const { jwt } = await account.createJWT();
      const res = await fetch('/api/blog/concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          existingConcepts,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSuggestNote(data?.error || 'No se pudieron sugerir conceptos.');
        return;
      }
      const suggested: string[] = Array.isArray(data.concepts) ? data.concepts : [];
      const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const merged = [...concepts];
      let added = 0;
      for (const c of suggested) {
        const clean = c.trim();
        if (clean && !merged.some(m => norm(m) === norm(clean))) {
          merged.push(clean);
          added++;
        }
      }
      setConcepts(merged);
      const via = data.source === 'gemini' ? 'IA (Gemini)' : 'heurística';
      setSuggestNote(
        (data.warning ? `⚠ ${data.warning} ` : '') +
        (added > 0
          ? `+${added} concepto(s) vía ${via}. Revisalos y ajustá.`
          : `Sin conceptos nuevos (vía ${via}).`)
      );
    } catch (error) {
      console.error('Error suggesting concepts:', error);
      setSuggestNote('Error al conectar con el servicio de sugerencias.');
    } finally {
      setSuggesting(false);
    }
  };

  // Valores efectivos que realmente se indexan (con sus fallbacks del render real).
  const effectiveSeoTitle = seoTitle.trim() || title;
  const effectiveSeoDesc = seoDescription.trim() || excerpt;

  // Checklist de calidad SEO que se muestra al editor en tiempo real.
  const seoChecks = [
    { ok: title.trim().length > 0, label: 'Título' },
    { ok: excerpt.trim().length >= 50, label: 'Resumen (≥50)' },
    { ok: effectiveSeoTitle.length > 0 && effectiveSeoTitle.length <= SEO_TITLE_MAX, label: `SEO title ≤${SEO_TITLE_MAX}` },
    { ok: effectiveSeoDesc.length >= SEO_DESC_MIN && effectiveSeoDesc.length <= SEO_DESC_MAX, label: `Meta desc. ${SEO_DESC_MIN}-${SEO_DESC_MAX}` },
    { ok: coverImage.trim().length > 0, label: 'Imagen de portada' },
    { ok: !coverImage.trim() || coverImageAlt.trim().length > 0, label: 'Alt de portada' },
    { ok: tags.length > 0, label: 'Al menos 1 etiqueta' },
  ];
  const seoScore = seoChecks.filter(c => c.ok).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('El título y el slug son requeridos.');
      setActiveTab('settings');
      return;
    }
    // El excerpt es obligatorio en la base de datos y es el fallback de la meta description.
    if (!excerpt.trim()) {
      alert('El resumen (excerpt) es obligatorio: se usa como meta description y en las tarjetas del blog.');
      setActiveTab('settings');
      return;
    }
    // Aviso no bloqueante si el SEO queda flojo, para no publicar a ciegas.
    const weak = seoChecks.filter(c => !c.ok);
    if (weak.length > 0) {
      const proceed = confirm(
        `El SEO tiene ${weak.length} punto(s) por mejorar:\n\n` +
        weak.map(c => `• ${c.label}`).join('\n') +
        `\n\n¿Guardar de todas formas?`
      );
      if (!proceed) {
        setActiveTab('settings');
        return;
      }
    }
    setSaving(true);
    try {
      // Calculamos el embedding semántico del post para conectar artículos afines
      // en el grafo. Si falla (sin API key, red, etc.), guardamos igual sin él.
      const embedding = await computeEmbedding();

      await onSave({
        title,
        slug,
        excerpt,
        content,
        published,
        featured,
        newsletter,
        noindex,
        coverImage: coverImage.trim() !== '' ? coverImage.trim() : null as any,
        coverImageAlt: coverImageAlt.trim() !== '' ? coverImageAlt.trim() : null as any,
        publishedAt: publishedAt || undefined,
        tags,
        concepts,
        ...(embedding ? { embedding } : {}),
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

  const inputClass =
    'w-full px-4 py-2 text-xs rounded-xl border border-dust-grey/20 dark:border-pale-sky/10 bg-white/50 dark:bg-gunmetal/30 focus:ring-2 focus:ring-cool-sky/40 focus:border-cool-sky/40 outline-none transition';

  return (
    <div className="fixed inset-0 bg-white dark:bg-gunmetal z-[100] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Editorial Header bar */}
      <header className="h-20 border-b border-dust-grey/20 dark:border-pale-sky/10 flex items-center justify-between px-4 md:px-8 shrink-0 bg-white/80 dark:bg-gunmetal/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gunmetal/60 dark:text-pale-sky/60" />
          </button>
          <div className="h-6 w-[1px] bg-dust-grey/20 dark:border-pale-sky/10 mx-1 md:mx-2 hidden sm:block" />
          <h2 className="text-lg md:text-xl font-display font-semibold text-gunmetal dark:text-alice-blue truncate max-w-[140px] md:max-w-[300px]">
            {title || 'Nuevo Post'}
          </h2>
          {published && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20 hidden sm:inline">
              Publicado
            </span>
          )}
        </div>

        {/* View Switchers */}
        <div className="hidden sm:flex items-center bg-dust-grey/10 dark:bg-pale-sky/5 p-1 rounded-2xl">
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

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
             <span className="text-[10px] uppercase tracking-widest text-gunmetal/40 dark:text-pale-sky/40 font-bold">Tiempo lectura</span>
             <span className="text-xs font-semibold text-gunmetal/80 dark:text-pale-sky/80">{readingTime} min</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-cool-sky hover:bg-cool-sky/90 text-gunmetal px-5 md:px-8 py-3 rounded-2xl font-bold shadow-lg shadow-cool-sky/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
          >
            {saving ? 'Guardando...' : published ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Main Area (Left/Center) */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${activeTab === 'content' ? 'block' : 'hidden'} xl:block`}>
           <div className={`mx-auto max-w-6xl p-6 sm:p-8 lg:p-12 transition-all h-full ${viewMode === 'split' ? 'grid grid-cols-2 gap-12' : ''}`}>

              {/* Write Mode */}
              {(viewMode === 'edit' || viewMode === 'split') && (
                <div className="flex flex-col h-full space-y-8 animate-in slide-in-from-left-4 fade-in">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título del post..."
                    className="text-3xl sm:text-5xl font-display font-bold bg-transparent border-none outline-none text-gunmetal dark:text-alice-blue placeholder:text-gunmetal/10 dark:placeholder:text-pale-sky/10 p-0 focus:ring-0"
                  />

                  <div className="flex-1 min-h-[500px]" data-color-mode={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                    <MDEditor
                      value={content}
                      onChange={(value) => setContent(value || '')}
                      commands={[
                        ...commands.getCommands(),
                        commands.divider,
                        {
                          name: 'insertObsidianLink',
                          keyCommand: 'insertObsidianLink',
                          buttonProps: { 'aria-label': 'Insert Obsidian Link', title: 'Insert Obsidian Link' },
                          icon: (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                            </svg>
                          ),
                          execute: (state, api) => {
                            let modifyText = `[[${state.selectedText || 'slug-del-post'}]]`;
                            api.replaceSelection(modifyText);
                          },
                        }
                      ]}
                      preview="edit"
                      hideToolbar={false}
                      previewOptions={{
                        rehypePlugins: [[rehypeRaw as any, { passThrough: ['element'] }]]
                      }}
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

        {/* Sidebar (Right) — en xl siempre visible; en pantallas chicas se muestra con el tab "Ajustes". */}
        <aside className={`${activeTab === 'settings' ? 'block' : 'hidden'} xl:block w-full xl:w-80 border-l border-dust-grey/20 dark:border-pale-sky/10 bg-alice-blue/30 dark:bg-gunmetal/20 shrink-0 overflow-y-auto p-6 space-y-8 pb-28 xl:pb-8`}>
            {/* SEO Score */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                  <DocumentTextIcon className="w-3 h-3" /> Calidad SEO
                </h3>
                <span className={`text-xs font-black ${seoScore === seoChecks.length ? 'text-green-500' : seoScore >= 4 ? 'text-amber-500' : 'text-red-500'}`}>
                  {seoScore}/{seoChecks.length}
                </span>
              </div>
              <div className="bg-white dark:bg-gunmetal/50 rounded-2xl p-4 border border-dust-grey/20 dark:border-pale-sky/10 space-y-2">
                {seoChecks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-[11px]">
                    <span className={c.ok ? 'text-green-500' : 'text-gunmetal/30 dark:text-pale-sky/30'}>
                      {c.ok ? '✓' : '○'}
                    </span>
                    <span className={c.ok ? 'text-gunmetal/70 dark:text-pale-sky/70' : 'text-gunmetal/40 dark:text-pale-sky/40'}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

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
                <div className="flex items-center justify-between">
                  <label htmlFor="noindex-toggle" className="flex flex-col text-sm font-semibold text-gunmetal/80 dark:text-pale-sky/80 cursor-pointer">
                    No indexar
                    <span className="text-[9px] font-normal text-gunmetal/40 dark:text-pale-sky/40">Oculto para Google (noindex)</span>
                  </label>
                  <input
                    id="noindex-toggle"
                    type="checkbox"
                    checked={noindex}
                    onChange={(e) => setNoindex(e.target.checked)}
                    className="w-5 h-5 accent-cool-sky rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </section>

            {/* Publish date */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <CalendarDaysIcon className="w-3 h-3" /> Fecha de Publicación
              </h3>
              <input
                type="datetime-local"
                value={toLocalInput(publishedAt)}
                onChange={(e) => setPublishedAt(fromLocalInput(e.target.value))}
                className={inputClass}
              />
              <p className="text-[9px] text-gunmetal/40 dark:text-pale-sky/40 leading-relaxed">
                Dejala vacía para que se fije automáticamente al publicar. Podés antedatar un artículo si lo necesitás.
              </p>
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
                  className={`${inputClass} text-cool-sky font-mono`}
                  placeholder="slug-del-post"
                />
              </div>
            </section>

            {/* Excerpt / Resumen */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                  <DocumentTextIcon className="w-3 h-3" /> Resumen <span className="text-red-400 normal-case">*</span>
                </h3>
                <CharMeter value={excerpt.length} max={EXCERPT_MAX} min={50} />
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                maxLength={EXCERPT_MAX}
                placeholder="Frase gancho que resume el artículo. Se usa en las tarjetas del blog y como meta description si no completás una específica."
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </section>

            {/* Cover Image */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <PhotoIcon className="w-3 h-3" /> Imagen de Portada
              </h3>
              <div className="group relative aspect-video rounded-2xl border-2 border-dashed border-dust-grey/30 dark:border-pale-sky/20 overflow-hidden bg-white/5 dark:bg-gunmetal/20 flex items-center justify-center transition-all hover:border-cool-sky/50">
                {coverImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImage} className="w-full h-full object-cover" alt={coverImageAlt || 'Cover'} />
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
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
              {coverImage && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold opacity-50 uppercase">Texto alternativo (alt)</label>
                  <input
                    type="text"
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    className={inputClass}
                    placeholder="Describe la imagen para accesibilidad y SEO"
                  />
                </div>
              )}
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
                  className={inputClass}
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

            {/* Conceptos (grafo neural) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                  <ShareIcon className="w-3 h-3" /> Conceptos
                </h3>
                <button
                  type="button"
                  onClick={handleSuggestConcepts}
                  disabled={suggesting}
                  className="flex items-center gap-1 text-[9px] font-bold text-violet-500 hover:text-violet-400 disabled:opacity-40 transition-colors"
                >
                  <SparklesIcon className={`w-3 h-3 ${suggesting ? 'animate-pulse' : ''}`} />
                  {suggesting ? 'Analizando...' : 'Sugerir con IA'}
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] text-gunmetal/40 dark:text-pale-sky/40 leading-relaxed">
                  Ideas o temas centrales del post. Conectan artículos en el grafo neural cuando comparten un concepto.
                </p>
                <input
                  type="text"
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  onKeyDown={handleAddConcept}
                  className={inputClass}
                  placeholder="Añadir concepto y Enter..."
                  list="existing-concepts"
                />
                <datalist id="existing-concepts">
                  {existingConcepts.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {suggestNote && (
                  <p className="text-[9px] text-violet-500 leading-relaxed">{suggestNote}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {concepts.map(c => (
                    <span key={c} className="px-2 py-1 bg-violet-500/10 text-violet-500 text-[10px] font-bold rounded-lg border border-violet-500/20 flex items-center gap-1">
                      {c}
                      <button onClick={() => removeConcept(c)} className="hover:text-red-500">✕</button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* SEO Tool */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gunmetal/40 dark:text-pale-sky/40">
                <GlobeAltIcon className="w-3 h-3" /> SEO & Social
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold opacity-50 uppercase">SEO Title</label>
                    <div className="flex items-center gap-2">
                      {!seoTitle && title && (
                        <button
                          type="button"
                          onClick={() => setSeoTitle(title.slice(0, SEO_TITLE_MAX))}
                          className="text-[9px] font-bold text-cool-sky hover:underline"
                        >
                          usar título
                        </button>
                      )}
                      <CharMeter value={effectiveSeoTitle.length} ideal={SEO_TITLE_MAX} max={SEO_TITLE_MAX} />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Título para buscadores'}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold opacity-50 uppercase">SEO Description</label>
                    <div className="flex items-center gap-2">
                      {!seoDescription && excerpt && (
                        <button
                          type="button"
                          onClick={() => setSeoDescription(excerpt.slice(0, SEO_DESC_MAX))}
                          className="text-[9px] font-bold text-cool-sky hover:underline"
                        >
                          usar resumen
                        </button>
                      )}
                      <CharMeter value={effectiveSeoDesc.length} ideal={SEO_DESC_MAX} max={SEO_DESC_MAX} min={SEO_DESC_MIN} />
                    </div>
                  </div>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder={excerpt || 'Descripción para resultados de búsqueda (120-160 caracteres)'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Vista previa de resultado de Google */}
                <div className="mt-2 p-3 rounded-xl bg-white dark:bg-gunmetal/50 border border-dust-grey/20 dark:border-pale-sky/10 space-y-0.5">
                  <p className="text-[8px] uppercase tracking-widest font-black text-gunmetal/30 dark:text-pale-sky/30 mb-1">Vista previa Google</p>
                  <p className="text-[11px] text-[#1a0dab] dark:text-[#8ab4f8] truncate leading-tight">{effectiveSeoTitle || 'Título del post'}</p>
                  <p className="text-[9px] text-green-700 dark:text-green-500 truncate">tomasameri.com › blog › {slug || 'slug'}</p>
                  <p className="text-[10px] text-gunmetal/60 dark:text-pale-sky/60 line-clamp-2 leading-snug">{effectiveSeoDesc || 'La meta description aparecerá acá...'}</p>
                </div>
              </div>
            </section>
        </aside>

        {/* Floating Mobile Bottom Nav — alterna entre escribir y ajustes/SEO en pantallas chicas. */}
        <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gunmetal/90 backdrop-blur-xl border border-dust-grey/20 dark:border-pale-sky/10 px-4 py-2 rounded-3xl shadow-2xl flex gap-2 z-50">
           <button
             onClick={() => setActiveTab('content')}
             className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'content' ? 'bg-cool-sky text-gunmetal' : 'text-gunmetal/50 dark:text-pale-sky/50'}`}
           >
             <PencilIcon className="w-5 h-5" /> Escribir
           </button>
           <button
             onClick={() => setActiveTab('settings')}
             className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-cool-sky text-gunmetal' : 'text-gunmetal/50 dark:text-pale-sky/50'}`}
           >
             <Cog6ToothIcon className="w-5 h-5" /> Ajustes
             <span className={`text-[9px] font-black ${seoScore === seoChecks.length ? 'text-green-500' : 'text-amber-500'} ${activeTab === 'settings' ? '!text-gunmetal' : ''}`}>{seoScore}/{seoChecks.length}</span>
           </button>
        </div>
      </main>
    </div>
  );
}
