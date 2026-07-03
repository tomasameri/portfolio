'use client';

import { useEffect } from 'react';

/**
 * El `<html>` vive en el root layout (que no conoce el locale de la ruta),
 * así que ajustamos `document.documentElement.lang` en el cliente según el
 * locale activo. Mejora accesibilidad y lo que ven lectores de pantalla.
 * La señal SEO fuerte de idioma la dan los hreflang de generateMetadata.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
