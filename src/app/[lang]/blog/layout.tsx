import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artículos sobre IA, tecnología y diseño. Ideas, experimentos y aprendizajes de Tomas Ameri.',
  openGraph: {
    title: 'Blog',
    description:
      'Artículos sobre IA, tecnología y diseño. Ideas, experimentos y aprendizajes de Tomas Ameri.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
