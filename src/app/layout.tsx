// src/app/layout.tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope, Space_Grotesk, Anonymous_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, DEFAULT_LOCALE, LOCALES } from '@/lib/siteConfig';

// ─── Editorial Design System Fonts ───────────────────────────────────────
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Legacy font — kept for admin panel backward compatibility
const anonymousPro = Anonymous_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anonymous-pro',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['portfolio', 'blog', 'web development', 'AI', 'tech', 'design'],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: `${SITE_URL}/${DEFAULT_LOCALE}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`])),
      'x-default': `${SITE_URL}/${DEFAULT_LOCALE}`,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${plusJakarta.variable} ${manrope.variable} ${spaceGrotesk.variable} ${anonymousPro.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}