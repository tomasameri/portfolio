'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkWikiLink from 'remark-wiki-link';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="bg-white dark:bg-gunmetal/30 rounded-3xl p-8 border border-dust-grey/20 dark:border-pale-sky/10 min-h-full shadow-inner overflow-y-auto">
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-cool-sky prose-img:rounded-2xl prose-pre:bg-gunmetal prose-pre:rounded-xl">
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
            [remarkWikiLink, { 
              aliasDivider: '|',
              pageResolver: (name: string) => [name.trim()], 
              hrefTemplate: (permalink: string) => `/blog/${permalink.trim()}` 
            }]
          ]}
          rehypePlugins={[rehypeRaw]}
        >
          {content || '*Escribe algo para ver la previa...*'}
        </ReactMarkdown>
      </div>
    </div>
  );
}
