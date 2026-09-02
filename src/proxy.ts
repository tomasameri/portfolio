// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/siteConfig';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files, Next.js internal routes, API endpoints, and metadata assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next();
  }

  // Check if pathname already starts with a supported locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If path is root '/', redirect to default locale (/es) permanently
  if (pathname === '/') {
    const url = new URL(`/${DEFAULT_LOCALE}`, req.url);
    return NextResponse.redirect(url, 308);
  }

  // For other paths without locale prefix, prepend default locale
  const url = new URL(`/${DEFAULT_LOCALE}${pathname}`, req.url);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)'],
};
