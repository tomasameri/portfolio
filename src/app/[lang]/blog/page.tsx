'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/services/blogService';
import type { BlogPost } from '@/lib/services/blogService';
import NewsletterToast from '@/components/NewsletterToast';
import { ListBulletIcon, ShareIcon } from '@heroicons/react/24/outline';
import BlogGraph from '@/components/BlogGraph';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

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
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <header className="mb-20 text-center flex flex-col items-center">
        <h1 className="text-6xl font-display font-bold mb-4 text-gunmetal dark:text-alice-blue tracking-tighter italic">Journal</h1>
        <p className="text-gunmetal/50 dark:text-pale-sky/50 font-medium mb-12">Reflexiones sobre diseño, código y producto.</p>
        
        <div className="inline-flex bg-dust-grey/10 dark:bg-pale-sky/10 backdrop-blur-md p-1.5 rounded-2xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-gunmetal/80 shadow-md text-gunmetal dark:text-alice-blue scale-100' : 'text-gunmetal/50 dark:text-pale-sky/50 hover:text-gunmetal hover:dark:text-alice-blue/80 scale-95 hover:bg-white/50 dark:hover:bg-gunmetal/30'}`}
          >
            <ListBulletIcon className="w-5 h-5" />
            Feed
          </button>
          <button 
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${viewMode === 'graph' ? 'bg-white dark:bg-gunmetal/80 shadow-md text-cool-sky dark:text-cool-sky scale-100' : 'text-gunmetal/50 dark:text-pale-sky/50 hover:text-gunmetal hover:dark:text-alice-blue/80 scale-95 hover:bg-white/50 dark:hover:bg-gunmetal/30'}`}
          >
            <ShareIcon className="w-5 h-5" />
            Grafo Neural
          </button>
        </div>
      </header>
      
      <div className="space-y-24">
        {posts.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-24 animate-in fade-in duration-500">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="grid md:grid-cols-12 gap-8 items-center cursor-pointer">
                    {/* Image Side */}
                    <div className="md:col-span-5 aspect-[4/3] rounded-3xl overflow-hidden bg-dust-grey/10 dark:bg-pale-sky/5 border border-dust-grey/10 dark:border-pale-sky/10 shadow-lg shadow-cool-sky/5 group-hover:shadow-cool-sky/15 transition-all duration-500">
                      {post.coverImage ? (
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20 italic font-display text-2xl">
                           {post.title.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-cool-sky/60">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-3xl md:text-4xl font-display font-bold text-gunmetal dark:text-alice-blue group-hover:text-cool-sky transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-gunmetal/60 dark:text-pale-sky/60 line-clamp-2 text-lg">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gunmetal/30 dark:text-pale-sky/30 pt-4">
                        {post.publishedAt && (
                          <time>
                            {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        )}
                        <span className="w-1 h-1 bg-dust-grey rounded-full opacity-30" />
                        <span>{post.readingTime || 5} min read</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <BlogGraph posts={posts} />
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-alice-blue dark:bg-gunmetal/20 rounded-3xl border border-dashed border-dust-grey/20">
            <p className="text-gunmetal/40 dark:text-pale-sky/40 italic">Aún no hay historias para contar.</p>
          </div>
        )}
      </div>
      <NewsletterToast />
    </div>
  );
}
