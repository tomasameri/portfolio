'use client';

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { BlogPost } from '@/lib/services/blogService';

interface BlogGraphClientProps {
  posts: BlogPost[];
}

export default function BlogGraphClient({ posts }: BlogGraphClientProps) {
  const { darkMode } = useTheme();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (fgRef.current) {
      // Configurar la física de los nodos
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(120);
      fgRef.current.d3Force('center').strength(0.05); // Suavizar la atracción al centro para más visibilidad
    }
  }, [mounted, posts]);

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isDark = darkMode;

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const tagsSet = new Set<string>();
    
    // Diccionario temporal para asegurar que no duplicamos nodos o buscar slugs
    const postSlugsMap = new Map();
    posts.forEach(post => postSlugsMap.set(post.slug, post.id));

    posts.forEach(post => {
      nodes.push({
        id: post.id,
        name: post.title,
        group: 'post',
        val: 20,
        post
      });

      // 1. Conexiones con Tags
      post.tags?.forEach(tag => {
        const tagId = `tag-${tag}`;
        if (!tagsSet.has(tag)) {
          tagsSet.add(tag);
          nodes.push({
            id: tagId,
            name: `#${tag}`,
            group: 'tag',
            val: 8
          });
        }
        links.push({
          source: post.id,
          target: tagId,
          type: 'tag'
        });
      });

      // 2. Conexiones Directas (Mentions / Enlaces Internos)
      if (post.content) {
        // Escanear sintaxis Obisdian: [[slug-del-post]] o [[slug-del-post|Texto alternativo]]
        const obsidianRegex = /\[\[(.*?)(?:\|.*?)?\]\]/g;
        let obsidianMatch;
        while ((obsidianMatch = obsidianRegex.exec(post.content)) !== null) {
          const mentionedSlug = obsidianMatch[1].trim();
          if (postSlugsMap.has(mentionedSlug)) {
            links.push({
              source: post.id,
              target: postSlugsMap.get(mentionedSlug),
              type: 'mention'
            });
          }
        }

        // Escanear links Markdowns clásicos: [texto](/blog/slug) o [texto](/es/blog/slug)
        const mdLinkRegex = /\[.*?\]\((?:\/[a-z]{2})?\/blog\/([^\)]+)\)/g;
        let mdMatch;
        while ((mdMatch = mdLinkRegex.exec(post.content)) !== null) {
          const mentionedSlug = mdMatch[1].replace(/\/$/, ''); // por si tiene slash al final
          if (postSlugsMap.has(mentionedSlug)) {
            links.push({
              source: post.id,
              target: postSlugsMap.get(mentionedSlug),
              type: 'mention'
            });
          }
        }
      }
    });

    return { nodes, links };
  }, [posts]);

  // Colors
  const postColor = isDark ? '#386ff0' : '#2255cc';
  const tagColor = isDark ? '#8d94a0' : '#717c8d';
  const mentionLinkColor = isDark ? 'rgba(56, 111, 240, 0.4)' : 'rgba(34, 85, 204, 0.4)';
  const tagLinkColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const handleNodeClick = useCallback((node: any) => {
    if (node.group === 'post' && node.post) {
      router.push(`/blog/${node.post.slug}`);
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="w-full h-[600px] border border-dust-grey/20 dark:border-pale-sky/20 rounded-3xl overflow-hidden bg-white/50 dark:bg-gunmetal/20 backdrop-blur-sm shadow-xl relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: postColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Posts</span>
        <div className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: tagColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Tags</span>
      </div>
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        d3VelocityDecay={0.1}
        nodeLabel="name"
        nodeColor={(node: any) => node.group === 'post' ? postColor : tagColor}
        linkColor={(link: any) => link.type === 'mention' ? mentionLinkColor : tagLinkColor}
        nodeRelSize={4}
        linkWidth={(link: any) => link.type === 'mention' ? 2 : 1}
        onNodeClick={handleNodeClick}
        backgroundColor="transparent"
      />
    </div>
  );
}
