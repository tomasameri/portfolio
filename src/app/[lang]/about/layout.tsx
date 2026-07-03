import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { profilePageSchema } from '@/lib/schema';
import { PERSON_DESCRIPTION } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'About',
  description: PERSON_DESCRIPTION,
  openGraph: {
    title: 'About',
    description: PERSON_DESCRIPTION,
    type: 'profile',
  },
};

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
