'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BentoCard as BentoCardType } from '@/types/bento';
import { useState } from 'react';
import SocialIcon from './SocialIcon';

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-1 row-span-1',
  large: 'col-span-1 md:col-span-2 row-span-2',
  wide: 'col-span-1 md:col-span-2 row-span-1',
  tall: 'col-span-1 row-span-1 md:row-span-2',
};

interface BentoCardProps {
  card: BentoCardType;
}

export default function BentoCard({ card }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    group relative overflow-hidden rounded-xl
    bg-alice-blue dark:bg-pale-sky/15
    border border-dust-grey/40 dark:border-pale-sky/25
    shadow-sm hover:shadow-lg
    transition-all duration-300 ease-out
    hover:scale-[1.01] hover:border-cool-sky/40 dark:hover:border-cool-sky/30
    ${sizeClasses[card.size]}
  `;

  const content = (
    <div className="h-full p-6 flex flex-col">
      {card.image && (
        <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-dust-grey/20 dark:bg-pale-sky/10">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {card.socialPlatform && !card.image && (
        <div className="mb-4 flex items-center justify-center">
          <SocialIcon platform={card.socialPlatform} size={48} />
        </div>
      )}
      {card.icon && !card.image && !card.socialPlatform && (
        <div className="mb-4 text-5xl flex items-center justify-center">{card.icon}</div>
      )}

      {card.title && (
        <h3 className="text-lg font-semibold text-gunmetal dark:text-alice-blue mb-2">
          {card.title}
        </h3>
      )}

      {card.description && (
        <p className="text-sm text-gunmetal/70 dark:text-pale-sky/80 mb-4 flex-grow leading-relaxed">
          {card.description}
        </p>
      )}

      {card.content && (
        <div className="flex-grow">{card.content}</div>
      )}
    </div>
  );

  if (card.url) {
    return (
      <Link
        href={card.url}
        className={baseClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cool-sky/8 dark:from-cool-sky/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  return (
    <div
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </div>
  );
}

