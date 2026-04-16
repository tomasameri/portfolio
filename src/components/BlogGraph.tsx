import dynamic from 'next/dynamic';
import type { BlogPost } from '@/lib/services/blogService';

// Dynamically import the Force Graph component with SSR disabled
// because it relies on window/canvas which are not available on the server
const ForceGraphClient = dynamic(
  () => import('./BlogGraphClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] border border-dust-grey/20 dark:border-pale-sky/20 rounded-3xl overflow-hidden bg-white/50 dark:bg-gunmetal/20 backdrop-blur-sm flex items-center justify-center shadow-inner relative">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-cool-sky animate-spin"></div>
          <p className="text-sm uppercase tracking-widest font-bold text-gunmetal/50 dark:text-pale-sky/50">Cargando Grafo Neural...</p>
        </div>
      </div>
    )
  }
);

interface BlogGraphProps {
  posts: BlogPost[];
}

export default function BlogGraph({ posts }: BlogGraphProps) {
  return <ForceGraphClient posts={posts} />;
}
