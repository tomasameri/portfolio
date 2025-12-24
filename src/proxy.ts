// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

// Supported languages
const locales = ['en', 'es'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (locales.includes(preferredLang)) {
      return preferredLang;
    }
  }
  return defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip static files, API routes, etc.
  if (
    pathname.startsWith('/_next/') || 
    pathname.includes('.') || 
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/next.svg' ||
    pathname === '/vercel.svg' ||
    pathname === '/file.svg' ||
    pathname === '/globe.svg' ||
    pathname === '/window.svg'
  ) {
    return NextResponse.next();
  }

  // Check if the path has a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If the path already has a valid locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the default locale if the path is the root
  if (pathname === '/') {
    const locale = getLocale(req);
    const url = new URL(`/${locale}`, req.url);
    return NextResponse.redirect(url);
  }

  // For other paths, try to prepend the locale
  const locale = getLocale(req);
  const newPathname = `/${locale}${pathname}`;
  const url = new URL(newPathname, req.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};

