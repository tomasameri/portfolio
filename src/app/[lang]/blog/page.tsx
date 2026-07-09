import { getPublishedPosts } from '@/lib/services/blogService';
import BlogClient from './BlogClient';

// Renderizado en servidor con ISR: el listado de posts viaja en el HTML inicial
// (indexable por Google). Se refresca cada hora para recoger posts nuevos.
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogClient posts={posts} />;
}
