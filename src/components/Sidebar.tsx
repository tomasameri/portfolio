'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';

export default function Sidebar() {
  const { locale, messages } = useLocale();
  const quote = "Your time is limited, so don't waste it living someone else's life.";

  return (
    <aside className="w-full md:w-64 lg:w-80 flex-shrink-0">
      <div className="sticky top-8 space-y-8">
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-surface-container ring-2 ring-on-surface-muted/10">
            <Image
              src="/imagen perfil.jpeg"
              alt="Tomas Ameri"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-center md:text-left">
          <h1 className="font-display text-display-md text-on-surface tracking-tight">
            Tomas Ameri
          </h1>
        </div>

        {/* Quote */}
        <blockquote className="mx-auto md:mx-0 max-w-xs md:max-w-none text-center md:text-left md:pl-5 md:border-l-2 border-accent/30">
          <div className="w-8 h-0.5 bg-accent/40 mx-auto mb-3 md:hidden" />
          <p className="font-body text-body-lg text-on-surface-variant italic leading-relaxed">
            &quot;{quote}&quot;
          </p>
          <div className="w-8 h-0.5 bg-accent/40 mx-auto mt-3 md:hidden" />
        </blockquote>

        <div />
      </div>
    </aside>
  );
}
