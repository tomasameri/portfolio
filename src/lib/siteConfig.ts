/**
 * Configuración central del sitio para SEO (URL canónica, locales, etc.).
 * Se puede sobreescribir la URL con NEXT_PUBLIC_SITE_URL en el entorno.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tomasameri.com'
).replace(/\/$/, '');

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const SITE_NAME = 'Tomas Ameri';
export const SITE_TITLE = 'Tomas Ameri | Portfolio & Blog';
export const SITE_DESCRIPTION =
  'Personal portfolio and blog of Tomas Ameri - Exploring AI, Tech & Design';

/** Foto de perfil (el nombre del archivo tiene un espacio → URL-encoded). */
export const PROFILE_IMAGE = `${SITE_URL}/imagen%20perfil.jpeg`;

/** Rol/descripción de la persona para el schema Person. */
export const PERSON_JOB_TITLE = 'Digital product builder';
export const PERSON_DESCRIPTION =
  'Systems student and digital product builder interested in marketplaces, automation, and applied artificial intelligence.';

/** Perfiles públicos → `sameAs` (clave para el Knowledge Graph y GEO). */
export const SOCIAL_LINKS = [
  'https://github.com/tomasameri',
  'https://linkedin.com/in/tomasameri',
  'https://twitter.com/toto_visiora',
  'https://youtube.com/@tomiameri',
  'https://instagram.com/tomiameri',
  'https://tiktok.com/@tomiameri',
];
