'use client';

import React, { useState } from 'react';
import { FaTwitter, FaLinkedin, FaLink, FaCheck } from 'react-icons/fa';

interface SocialShareBarProps {
  title: string;
  url: string;
  isEs?: boolean;
}

export default function SocialShareBar({
  title,
  url,
  isEs = true,
}: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  // X / Twitter share intent with via attribute
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=toto_visiora`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Error copying link:', err);
    }
  };

  return (
    <div className="my-8 py-4 px-5 rounded-2xl bg-surface-container-high/60 border border-on-surface-muted/10 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="font-label text-xs uppercase tracking-widest font-bold text-on-surface">
          {isEs ? 'Compartir artículo' : 'Share this article'}
        </span>
        <span className="text-xs text-on-surface-muted hidden sm:inline">
          {isEs ? '— ¿Te pareció útil?' : '— Found it useful?'}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black text-white hover:bg-black/80 transition-all text-xs font-semibold shadow-sm hover:scale-105"
          title="Compartir en X / Twitter"
        >
          <FaTwitter className="w-3.5 h-3.5" />
          <span>Post en X</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0077b5] text-white hover:bg-[#0077b5]/90 transition-all text-xs font-semibold shadow-sm hover:scale-105"
          title="Compartir en LinkedIn"
        >
          <FaLinkedin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-accent-container text-on-surface-variant hover:text-accent border border-on-surface-muted/10 transition-all text-xs font-medium"
          title="Copiar enlace"
        >
          {copied ? (
            <>
              <FaCheck className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-bold">{isEs ? '¡Copiado!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <FaLink className="w-3.5 h-3.5" />
              <span>{isEs ? 'Copiar link' : 'Copy link'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
