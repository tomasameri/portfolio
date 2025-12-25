'use client';

import { BentoCard } from '@/types/bento';
import SocialIcon from '@/components/SocialIcon';

export default function CardPreview({ card }: { card: BentoCard }) {
  return (
    <div className="p-4 bg-alice-blue dark:bg-pale-sky/10 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20">
      <div className="mb-2">
        {card.socialPlatform && (
          <div className="flex justify-center mb-2">
            <SocialIcon platform={card.socialPlatform} size={32} />
          </div>
        )}
        {card.icon && !card.socialPlatform && (
          <div className="text-3xl flex justify-center mb-2">{card.icon}</div>
        )}
      </div>
      {card.title && (
        <h3 className="text-sm font-semibold text-gunmetal dark:text-alice-blue mb-1">
          {card.title}
        </h3>
      )}
      {card.description && (
        <p className="text-xs text-gunmetal/70 dark:text-pale-sky/80 line-clamp-2">
          {card.description}
        </p>
      )}
      <div className="mt-2 text-xs text-gunmetal/50 dark:text-pale-sky/60">
        Tamaño: {card.size}
      </div>
    </div>
  );
}

