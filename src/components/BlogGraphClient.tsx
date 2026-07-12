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
  const didFitRef = useRef(false); // para encuadrar sólo una vez por dataset
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (fgRef.current) {
      // Configurar la física de los nodos
      fgRef.current.d3Force('charge').strength(-260);
      fgRef.current.d3Force('link').distance(90);
      // Centrado moderado: mantiene los clusters desconectados juntos (si es muy
      // débil, los componentes separados se van lejos y quedan diminutos al encuadrar).
      fgRef.current.d3Force('center').strength(0.2);
    }
    // Si cambian los posts, permitimos un nuevo auto-encuadre.
    didFitRef.current = false;
  }, [mounted, posts]);

  // Encuadra todo el grafo dentro del contenedor (usa todo el espacio, sin zoom excesivo).
  const fitGraph = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(500, 60);
    }
  }, []);

  // Re-encuadrar cuando cambian las dimensiones del contenedor (resize / orientación).
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(fitGraph, 200);
    return () => clearTimeout(t);
  }, [mounted, dimensions.width, dimensions.height, fitGraph]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Medimos el contenedor y observamos cambios. Corre cuando el contenedor ya
  // está en el DOM (mounted), así el canvas usa TODO el ancho real, no el default.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
    };
    measure(); // medición inicial inmediata
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  const isDark = darkMode;

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const tagsSet = new Set<string>();
    const conceptsMap = new Map<string, string>(); // clave normalizada -> id de nodo

    // Diccionario temporal para asegurar que no duplicamos nodos o buscar slugs
    const postSlugsMap = new Map();
    posts.forEach(post => postSlugsMap.set(post.slug, post.id));

    // Normalizamos el concepto para agrupar variantes (React ≈ react ≈ Réact).
    const normConcept = (c: string) =>
      c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

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

      // 1.b Conexiones con Conceptos (nodos compartidos → conectan posts entre sí)
      post.concepts?.forEach(concept => {
        const key = normConcept(concept);
        if (!key) return;
        let conceptId = conceptsMap.get(key);
        if (!conceptId) {
          conceptId = `concept-${key}`;
          conceptsMap.set(key, conceptId);
          nodes.push({
            id: conceptId,
            name: concept,
            group: 'concept',
            val: 12
          });
        }
        links.push({
          source: post.id,
          target: conceptId,
          type: 'concept'
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

    // 3. Conexiones por SIMILITUD SEMÁNTICA (embeddings)
    // Conecta posts temáticamente afines aunque no compartan el mismo texto de
    // concepto (ej. "React" ≈ "Next.js"). La similitud coseno se computa acá, gratis.
    const SIM_THRESHOLD = 0.62; // mínimo para considerar dos posts "relacionados"
    const MAX_SIM_PER_POST = 3; // evita el "ovillo": top-N vecinos por post

    // Parseamos los embeddings guardados (JSON de number[]).
    const vectors = posts.map(post => {
      if (!post.embedding) return null;
      try {
        const v = JSON.parse(post.embedding);
        return Array.isArray(v) && v.length ? (v as number[]) : null;
      } catch {
        return null;
      }
    });

    const cosine = (a: number[], b: number[]) => {
      const len = Math.min(a.length, b.length);
      let dot = 0, na = 0, nb = 0;
      for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
      }
      if (na === 0 || nb === 0) return 0;
      return dot / (Math.sqrt(na) * Math.sqrt(nb));
    };

    // Para cada post nos quedamos con sus vecinos más similares por encima del umbral.
    const simPairs = new Set<string>(); // dedup de aristas no dirigidas
    posts.forEach((post, i) => {
      if (!vectors[i]) return;
      const sims: { j: number; score: number }[] = [];
      posts.forEach((_, j) => {
        if (i === j || !vectors[j]) return;
        const score = cosine(vectors[i]!, vectors[j]!);
        if (score >= SIM_THRESHOLD) sims.push({ j, score });
      });
      sims
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SIM_PER_POST)
        .forEach(({ j, score }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (simPairs.has(key)) return;
          simPairs.add(key);
          links.push({
            source: post.id,
            target: posts[j].id,
            type: 'similarity',
            score,
          });
        });
    });

    return { nodes, links };
  }, [posts]);

  // Colors
  const postColor = isDark ? '#386ff0' : '#2255cc';
  const tagColor = isDark ? '#8d94a0' : '#717c8d';
  const conceptColor = isDark ? '#a78bfa' : '#7c3aed';
  const mentionLinkColor = isDark ? 'rgba(56, 111, 240, 0.4)' : 'rgba(34, 85, 204, 0.4)';
  const conceptLinkColor = isDark ? 'rgba(167, 139, 250, 0.35)' : 'rgba(124, 58, 237, 0.3)';
  const tagLinkColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const similarityColor = isDark ? '#34d399' : '#10b981'; // verde esmeralda (nodo/leyenda)
  const similarityLinkColor = isDark ? 'rgba(52, 211, 153, 0.55)' : 'rgba(16, 185, 129, 0.5)';

  const nodeColor = (node: any) => {
    if (node.group === 'post') return postColor;
    if (node.group === 'concept') return conceptColor;
    return tagColor;
  };

  const linkColor = (link: any) => {
    if (link.type === 'mention') return mentionLinkColor;
    if (link.type === 'concept') return conceptLinkColor;
    if (link.type === 'similarity') return similarityLinkColor;
    return tagLinkColor;
  };

  const handleNodeClick = useCallback((node: any) => {
    if (node.group === 'post' && node.post) {
      router.push(`/blog/${node.post.slug}`);
    }
  }, [router]);

  return (
    <div
      ref={containerRef}
      // touch-action:none permite que el grafo capture el gesto (pan/zoom) en
      // mobile en vez de que el navegador haga scroll de la página.
      style={{ touchAction: 'none' }}
      className="w-full h-[500px] sm:h-[600px] border border-dust-grey/20 dark:border-pale-sky/20 rounded-3xl overflow-hidden bg-white/50 dark:bg-gunmetal/20 backdrop-blur-sm shadow-xl relative group"
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: postColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Posts</span>
        <div className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: conceptColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Conceptos</span>
        <div className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: tagColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Tags</span>
        <span className="ml-2 w-4 border-t-2 border-dashed" style={{ borderColor: similarityColor }} />
        <span className="text-xs uppercase tracking-widest font-bold">Relacionados</span>
      </div>
      {mounted && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          d3VelocityDecay={0.1}
          // Pre-asentamos el layout antes del primer render para evitar el "estallido"
          // desde el centro y el zoom raro inicial.
          warmupTicks={100}
          cooldownTicks={120}
          onEngineStop={() => {
            // Encuadrar todo una sola vez cuando el layout se estabiliza.
            if (!didFitRef.current) {
              fitGraph();
              didFitRef.current = true;
            }
          }}
          nodeLabel="name"
          nodeColor={nodeColor}
          linkColor={linkColor}
          nodeRelSize={4}
          linkWidth={(link: any) => link.type === 'mention' ? 2 : link.type === 'similarity' ? 2 : link.type === 'concept' ? 1.5 : 1}
          // Las aristas de similitud van punteadas para distinguirlas de las estructurales.
          linkLineDash={(link: any) => link.type === 'similarity' ? [4, 3] : null}
          onNodeClick={handleNodeClick}
          backgroundColor="transparent"
        />
      )}
    </div>
  );
}
