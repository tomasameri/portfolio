import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Primer artículo del blog',
    excerpt: 'Un resumen corto del primer artículo del blog...',
    date: '14 de Diciembre, 2023',
  },
  {
    id: 2,
    title: 'Segundo artículo del blog',
    excerpt: 'Un resumen corto del segundo artículo del blog...',
    date: '15 de Diciembre, 2023',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="border-b border-gray-200 pb-8 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{post.excerpt}</p>
            <time className="text-sm text-gray-500">{post.date}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
