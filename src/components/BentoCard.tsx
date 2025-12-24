'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BentoCard as BentoCardType } from '@/types/bento';
import { useState } from 'react';

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
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    shadow-sm hover:shadow-lg
    transition-all duration-300 ease-out
    hover:scale-[1.01]
    ${sizeClasses[card.size]}
  `;

  const content = (
    <div className="h-full p-6 flex flex-col">
      {card.image && (
        <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {card.icon && !card.image && (
        <div className="mb-4 text-5xl flex items-center justify-center">{card.icon}</div>
      )}

      {card.title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {card.title}
        </h3>
      )}

      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow leading-relaxed">
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
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

