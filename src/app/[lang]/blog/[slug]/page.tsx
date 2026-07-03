import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkWikiLink from 'remark-wiki-link';
import { getPostBySlug } from '@/lib/services/blogService';
import NewsletterToast from '@/components/NewsletterToast';
import JsonLd from '@/components/JsonLd';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SITE_NAME, LOCALES } from '@/lib/siteConfig';

// Server-render en cada request para reflejar posts nuevos/editados y su metadata.
export const dynamic = 'force-dynamic';

// Cacheamos la lectura del post para no pegarle dos veces a Appwrite
// (una en generateMetadata y otra en el componente) dentro del mismo request.
const loadPost = cache((slug: string) => getPostBySlug(slug));

type Params = { lang: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || `${post.title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}/${lang}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
      ),
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang, slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 pt-22 pb-12 md:py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-gunmetal dark:text-alice-blue">
            Post no encontrado
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
    <div className="container mx-auto px-4 pt-22 pb-12 md:py-12 max-w-4xl animate-in fade-in duration-500">
      <JsonLd
        data={[
          blogPostingSchema(post, lang),
          breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/${lang}` },
            { name: 'Blog', url: `${SITE_URL}/${lang}/blog` },
            { name: post.title, url: `${SITE_URL}/${lang}/blog/${post.slug}` },
          ]),
        ]}
      />
      <Link
        href="/blog"
        className="text-cool-sky hover:text-cool-sky/80 transition-all mb-8 inline-flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al blog
      </Link>

      <article>
        {post.coverImage && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl shadow-cool-sky/10 border border-dust-grey/10 dark:border-pale-sky/10 ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <time dateTime={post.publishedAt}>
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
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              [remarkWikiLink, {
                aliasDivider: '|',
                pageResolver: (name: string) => [name.trim()],
                hrefTemplate: (permalink: string) => `/blog/${permalink.trim()}`
              }]
            ]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      <NewsletterToast />
    </div>
  );
}
