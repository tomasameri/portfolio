// src/app/[lang]/page.tsx
import type { Metadata } from 'next';
import { getCards } from '@/lib/services/cardsService';
import HomeClient from './HomeClient';
import { pageMetadata } from '@/lib/seo';

// Renderizado en servidor con ISR: el contenido (cards) viaja en el HTML inicial
// para que Google lo indexe sin depender de JS. Se refresca cada hora.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, '', {
    en: {
      title: 'Tomas Ameri | Digital Product Builder & Systems',
      description:
        'Personal portfolio of Tomas Ameri — Systems student and digital product builder exploring applied AI, automation, and marketplaces.',
    },
    es: {
      title: 'Tomas Ameri | Constructor de Productos Digitales & Sistemas',
      description:
        'Portfolio de Tomás Ameri — Estudiante de Sistemas y constructor de productos digitales explorando IA aplicada, automatización y marketplaces.',
    },
  });
}

export default async function Home() {
  const cards = await getCards();
  return <HomeClient cards={cards} />;
}
