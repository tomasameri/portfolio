import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, '/contact', {
    en: {
      title: 'Contact',
      description:
        'Get in touch with Tomás Ameri to discuss ideas, projects, or collaboration opportunities.',
    },
    es: {
      title: 'Contacto',
      description:
        'Ponte en contacto con Tomás Ameri para conversar sobre ideas, proyectos u oportunidades de colaboración.',
    },
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
