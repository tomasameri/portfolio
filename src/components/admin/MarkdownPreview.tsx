'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="bg-white dark:bg-gunmetal/30 rounded-3xl p-8 border border-dust-grey/20 dark:border-pale-sky/10 min-h-full shadow-inner overflow-y-auto">
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-cool-sky prose-img:rounded-2xl prose-pre:bg-gunmetal prose-pre:rounded-xl">
        <ReactMarkdown>{content || '*Escribe algo para ver la previa...*'}</ReactMarkdown>
      </div>
    </div>
  );
}
