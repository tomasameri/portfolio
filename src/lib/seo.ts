import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, LOCALES, DEFAULT_LOCALE } from '@/lib/siteConfig';

type Loc = (typeof LOCALES)[number];

interface Copy {
  title: string;
  description: string;
}

/**
 * Construye la metadata SEO de una página bajo /[lang]/<path>.
 *
 * Clave: fija un `canonical` propio por ruta y locale. Sin esto, las páginas
 * heredan el canonical del layout de `[lang]` (`/en` o `/es`) y Google las trata
 * como duplicados de la home, dejándolas fuera del índice.
 *
 * @param langRaw  El segmento `[lang]` sin validar.
 * @param path     Ruta relativa al locale, empezando con `/` (ej. `/about`). `''` = home.
 * @param copy     Título + descripción por locale.
 */
export function pageMetadata(
  langRaw: string,
  path: string,
  copy: Record<Loc, Copy>,
): Metadata {
  const locale: Loc = (LOCALES as readonly string[]).includes(langRaw)
    ? (langRaw as Loc)
    : DEFAULT_LOCALE;

  const { title, description } = copy[locale];
  const canonical = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}
