// src/app/layout.tsx
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope, Space_Grotesk, Anonymous_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
  title: 'Tomas Ameri | Portfolio & Blog',
  description: 'Personal portfolio and blog of Tomas Ameri - Exploring AI, Tech & Design',
  keywords: ['portfolio', 'blog', 'web development', 'AI', 'tech', 'design'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
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