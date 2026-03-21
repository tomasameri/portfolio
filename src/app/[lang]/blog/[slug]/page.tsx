'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '@/lib/services/blogService';
import type { BlogPost } from '@/lib/services/blogService';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPost = await getPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setError('Post no encontrado');
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          Cargando post...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-gunmetal dark:text-alice-blue">
            {error || 'Post no encontrado'}
          </h1>
          <Link
            href="/blog"
            className="text-cool-sky hover:text-cool-sky/80 transition-colors"
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Link
        href="/blog"
        className="text-cool-sky hover:text-cool-sky/80 transition-all mb-8 inline-flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al blog
      </Link>

      <article>
        {post.coverImage && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl shadow-cool-sky/10 border border-dust-grey/10 dark:border-pale-sky/10 ring-1 ring-black/5">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full aspect-video object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map(tag => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-cool-sky/10 text-cool-sky text-[10px] font-bold uppercase tracking-wider rounded-lg border border-cool-sky/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gunmetal dark:text-alice-blue leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gunmetal/40 dark:text-pale-sky/40 mb-12 pb-12 border-b border-dust-grey/10 dark:border-pale-sky/10">
          {post.publishedAt && (
            <time>
              {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.readingTime && (
            <>
              <span className="w-1 h-1 bg-dust-grey rounded-full opacity-30" />
              <span>{post.readingTime} min de lectura</span>
            </>
          )}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-cool-sky prose-img:rounded-3xl prose-pre:bg-gunmetal prose-pre:rounded-2xl shadow-cool-sky/5">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

