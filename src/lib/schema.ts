import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  PROFILE_IMAGE,
  PERSON_JOB_TITLE,
  PERSON_DESCRIPTION,
  SOCIAL_LINKS,
  LOCALES,
} from './siteConfig';
import type { BlogPost } from './services/blogService';
import type { Project } from './services/projectsService';

// @id estable para la entidad Persona: así el resto de nodos (WebSite, artículos, proyectos)
// la referencian y Google/GEO la tratan como una única entidad unificada.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Persona — ancla la identidad para el Knowledge Graph, Google E-E-A-T y motores generativos (GEO). */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: PROFILE_IMAGE,
    jobTitle: PERSON_JOB_TITLE,
    description: PERSON_DESCRIPTION,
    sameAs: SOCIAL_LINKS,
    knowsAbout: [
      'Artificial Intelligence',
      'Applied AI',
      'Next.js',
      'Full-Stack Development',
      'Marketplace Architecture',
      'Process Automation',
      'System Design',
      'TypeScript',
      'Appwrite',
      'Product Engineering',
    ],
    homeLocation: {
      '@type': 'Place',
      name: 'Buenos Aires, Argentina',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Digital Product Builder & Systems Engineer',
      skills: 'Applied AI, Full-Stack Next.js, Marketplace Architecture, Automation',
      occupationLocation: {
        '@type': 'Country',
        name: 'Argentina',
      },
    },
    worksFor: {
      '@type': 'Organization',
      name: 'CreatorPlace',
    },
  };
}

/** Sitio web — declara idiomas, autor y entidad publicadora. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: LOCALES as unknown as string[],
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

/** Artículo del blog — habilita rich results y optimiza citabilidad por motores de IA. */
export function blogPostingSchema(post: BlogPost, lang: string) {
  const url = `${SITE_URL}/${lang}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? [post.coverImage] : [PROFILE_IMAGE],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@id': PERSON_ID,
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: PERSON_JOB_TITLE,
    },
    publisher: {
      '@id': PERSON_ID,
      '@type': 'Person',
      name: SITE_NAME,
      image: PROFILE_IMAGE,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: lang === 'es' ? 'es-ES' : 'en-US',
    ...(post.tags && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    ...(post.concepts && post.concepts.length ? { about: post.concepts.map(c => ({ '@type': 'Thing', name: c })) } : {}),
    ...(post.readingTime
      ? { timeRequired: `PT${post.readingTime}M` }
      : {}),
  };
}

/** Página de perfil — Google la usa específicamente para perfiles de creadores/expertos. */
export function profilePageSchema(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE_URL}/${lang}/about`,
    inLanguage: lang === 'es' ? 'es-ES' : 'en-US',
    mainEntity: { '@id': PERSON_ID },
  };
}

/** Un proyecto individual como CreativeWork / SoftwareApplication, autoría atribuida a la persona. */
export function creativeWorkSchema(project: Project, lang: string) {
  const url =
    project.url || project.githubUrl || `${SITE_URL}/${lang}/projects`;
  const sameAs = [project.url, project.githubUrl].filter(Boolean) as string[];
  return {
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url,
    applicationCategory: 'BusinessApplication, DeveloperApplication',
    operatingSystem: 'Web',
    ...(project.image ? { image: project.image } : {}),
    ...(project.technologies && project.technologies.length
      ? { keywords: project.technologies.join(', ') }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
  };
}

/** Listado de proyectos como ItemList — estructura la galería de /projects. */
export function projectsItemListSchema(projects: Project[], lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects Portfolio',
    description: 'Digital products, marketplaces, automation tools, and experiments built by Tomas Ameri',
    itemListElement: projects.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: creativeWorkSchema(project, lang),
    })),
  };
}

/** Migas de pan — mejora cómo se muestra la ruta en resultados de búsqueda. */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
