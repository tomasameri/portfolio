'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/services/blogService';
import type { BlogPost } from '@/lib/services/blogService';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPublishedPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Error al cargar los posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">Blog</h1>
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          Cargando posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">Blog</h1>
        <div className="text-center py-12 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gunmetal dark:text-alice-blue">Blog</h1>
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-b border-dust-grey/30 dark:border-pale-sky/10 pb-8"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 text-gunmetal dark:text-alice-blue hover:text-cool-sky dark:hover:text-cool-sky transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gunmetal/70 dark:text-pale-sky/80 mb-2">{post.excerpt}</p>
              {post.publishedAt && (
                <time className="text-sm text-gunmetal/50 dark:text-pale-sky/60">
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </article>
          ))
        ) : (
          <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
            No hay posts publicados aún.
          </div>
        )}
      </div>
    </div>
  );
}
