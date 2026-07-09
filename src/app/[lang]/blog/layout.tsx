import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, '/blog', {
    en: {
      title: 'Blog',
      description:
        'Articles by Tomás Ameri on AI, technology, product, and design — ideas, experiments, and learnings.',
    },
    es: {
      title: 'Blog',
      description:
        'Artículos de Tomás Ameri sobre IA, tecnología y diseño — ideas, experimentos y aprendizajes.',
    },
  });
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
