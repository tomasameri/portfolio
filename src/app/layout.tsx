// src/app/layout.tsx
import type { Metadata } from 'next';
import { Anonymous_Pro } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
    <html lang="en" className={`${anonymousPro.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}