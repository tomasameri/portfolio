/**
 * Configuración central del sitio para SEO (URL canónica, locales, etc.).
 * Se puede sobreescribir la URL con NEXT_PUBLIC_SITE_URL en el entorno.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tomasameri.com'
).replace(/\/$/, '');

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const SITE_NAME = 'Tomas Ameri';
export const SITE_TITLE = 'Tomas Ameri | Portfolio & Blog';
export const SITE_DESCRIPTION =
  'Personal portfolio and blog of Tomas Ameri - Exploring AI, Tech & Design';
