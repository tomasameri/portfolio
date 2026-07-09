import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { profilePageSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = pageMetadata(lang, '/about', {
    en: {
      title: 'About',
      description:
        'Tomás Ameri — systems student and digital product builder focused on marketplaces, automation, and applied AI. Learn how I work and what drives me.',
    },
    es: {
      title: 'Sobre mí',
      description:
        'Tomás Ameri — estudiante de Sistemas y constructor de productos digitales enfocado en marketplaces, automatización e IA aplicada. Conocé cómo trabajo.',
    },
  });
  return { ...meta, openGraph: { ...meta.openGraph, type: 'profile' } };
}

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <JsonLd data={profilePageSchema(lang)} />
      {children}
    </>
  );
}
