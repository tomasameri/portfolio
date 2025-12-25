'use client';

import Link from 'next/link';
import BlogPostList from '@/components/admin/BlogPostList';

export default function AdminBlogPage() {
  return (
    <div className="min-h-screen bg-pale-sky dark:bg-gunmetal py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-cool-sky hover:text-cool-sky/80 transition-colors mb-4 inline-block"
          >
            ← Volver al Dashboard
          </Link>
        </div>
        <BlogPostList />
      </div>
    </div>
  );
}

