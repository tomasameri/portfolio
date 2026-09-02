'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';

interface AuthorBioCardProps {
  lang: string;
}

export default function AuthorBioCard({ lang }: AuthorBioCardProps) {
  const isEs = lang === 'es';

  return (
    <div className="my-16 p-8 md:p-10 rounded-3xl bg-surface-container border border-on-surface-muted/10 relative overflow-hidden shadow-sm">
      {/* Decorative accent blur */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        {/* Avatar */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-surface shadow-md bg-surface-container-high">
          <Image
            src="/imagen perfil.jpeg"
            alt="Tomas Ameri"
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        {/* Bio info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-display font-bold text-xl text-on-surface">
                  Tomas Ameri
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                  Author
                </span>
              </div>
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider mt-0.5">
                {isEs
                  ? 'Digital Product Builder & Systems Engineer'
                  : 'Digital Product Builder & Systems Engineer'}
              </p>
            </div>
          </div>

          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {isEs
              ? 'Estudiante de Sistemas y constructor de productos digitales enfocado en Inteligencia Artificial aplicada, automatización y marketplaces. Comparto aprendizajes sobre arquitectura de software, validación y producto.'
              : 'Systems student and digital product builder focused on applied AI, automation, and marketplaces. Writing about software architecture, rapid validation, and product systems.'}
          </p>

          {/* Action CTAs: Direct conversion to social followers */}
          <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {/* Follow on X */}
            <a
              href="https://twitter.com/toto_visiora"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-black/80 transition-all shadow-sm hover:scale-105"
            >
              <FaTwitter className="w-3.5 h-3.5" />
              <span>Seguir en X @toto_visiora</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/tomasameri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077b5] text-white text-xs font-semibold hover:bg-[#0077b5]/90 transition-all shadow-sm hover:scale-105"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
              <span>Conectar en LinkedIn</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/tomasameri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-accent-container text-on-surface-variant hover:text-accent border border-on-surface-muted/10 text-xs font-medium transition-all"
              title="GitHub"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GitHub</span>
            </a>

            {/* Contact */}
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-container text-accent text-xs font-semibold hover:bg-accent hover:text-white transition-all ml-auto"
            >
              <FaPaperPlane className="w-3 h-3" />
              <span>{isEs ? 'Hablemos' : 'Get in touch'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
