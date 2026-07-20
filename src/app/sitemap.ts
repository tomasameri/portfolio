import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/services/blogService';
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/siteConfig';

// Rutas estáticas del sitio (relativas al locale).
const STATIC_PATHS = ['', '/about', '/blog', '/projects', '/contact'];

// Refrescar el sitemap cada hora para recoger posts nuevos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Rutas estáticas para cada locale (están traducidas → cada locale es una
  // página distinta y legítima). Sin `lastModified`: no tenemos una fecha real
  // de contenido y usar `new Date()` daría una señal ruidosa que cambia cada vez
  // que se regenera el sitemap.
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  // Posts del blog publicados. Como el contenido no está traducido, solo
  // incluimos la URL canónica (locale por defecto) para no listar duplicados.
  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      // No incluimos en el sitemap los posts marcados como "no indexar".
      if (post.noindex) continue;

      const lastModified = post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishedAt
          ? new Date(post.publishedAt)
          : undefined;

      entries.push({
        url: `${SITE_URL}/${DEFAULT_LOCALE}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    }
  } catch {
    // Si Appwrite no está disponible, devolvemos al menos las rutas estáticas.
  }

  return entries;
}
