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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/blog"
        className="text-cool-sky hover:text-cool-sky/80 transition-colors mb-6 inline-block"
      >
        ← Volver al blog
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-4 text-gunmetal dark:text-alice-blue">
          {post.title}
        </h1>

        {post.publishedAt && (
          <time className="text-sm text-gunmetal/50 dark:text-pale-sky/60 mb-6 block">
            {new Date(post.publishedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none mt-8">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

