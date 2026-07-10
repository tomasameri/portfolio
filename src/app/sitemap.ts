import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/services/blogService';
import { SITE_URL, LOCALES } from '@/lib/siteConfig';

// Rutas estáticas del sitio (relativas al locale).
const STATIC_PATHS = ['', '/about', '/blog', '/projects', '/contact'];

// Refrescar el sitemap cada hora para recoger posts nuevos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Rutas estáticas para cada locale, con alternates hreflang.
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
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

  // Posts del blog publicados.
  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      // No incluimos en el sitemap los posts marcados como "no indexar".
      if (post.noindex) continue;

      const lastModified = post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishedAt
          ? new Date(post.publishedAt)
          : now;

      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
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
    }
  } catch {
    // Si Appwrite no está disponible, devolvemos al menos las rutas estáticas.
  }

  return entries;
}
