'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BentoCard as BentoCardType } from '@/types/bento';
import { useState } from 'react';
import SocialIcon from './SocialIcon';
import SocialProfilePreview from './SocialProfilePreview';

interface BentoCardProps {
  card: BentoCardType;
}

export default function BentoCard({ card }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determinar si la imagen debe ser de fondo
  const isBackgroundImage = card.image && (card.imageAsBackground || card.type === 'image');
  
  const baseClasses = `
    group relative overflow-hidden rounded-xl
    ${isBackgroundImage ? '' : 'bg-white dark:bg-gunmetal/50'}
    border border-dust-grey/20 dark:border-pale-sky/10
    shadow-sm hover:shadow-md
    transition-all duration-200 ease-out
    hover:scale-[1.02] hover:border-cool-sky/30 dark:hover:border-cool-sky/20
    h-full w-full
    ${!isBackgroundImage ? 'min-h-[180px]' : 'min-h-[180px]'}
  `;

  const content = (
    <div className={`h-full ${isBackgroundImage ? 'relative' : card.size === 'small' ? 'p-4 flex flex-col' : 'p-6 flex flex-col'}`}>
      {/* Imagen de fondo que ocupa todo el card */}
      {isBackgroundImage && card.image && (
        <div className="absolute inset-0">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          {/* Overlay oscuro para mejor legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Contenido sobre la imagen */}
          <div className="relative h-full p-6 flex flex-col justify-end text-white">
            {card.title && (
              <h3 className="text-xl font-semibold mb-2 drop-shadow-lg">
                {card.title}
              </h3>
            )}
            {card.description && (
              <p className="text-sm text-white/90 drop-shadow-md leading-relaxed">
                {card.description}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Imagen normal (no de fondo) */}
      {card.image && !isBackgroundImage && (
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
        <div className={`${card.size === 'small' ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'} flex flex-grow`}>
          {card.socialUsername ? (
            <SocialProfilePreview 
              platform={card.socialPlatform} 
              username={card.socialUsername}
              url={card.url}
              cardSize={card.size}
            />
          ) : (
            <div className={`${card.size === 'small' ? 'flex-row items-center gap-2' : 'flex-col items-center justify-center'} flex`}>
              <div className={`${card.size === 'small' ? 'w-8 h-8' : 'w-24 h-24'} rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 ${card.size === 'small' ? '' : 'mb-3'} flex items-center justify-center border-2 border-cool-sky/30`}>
                <SocialIcon platform={card.socialPlatform} size={card.size === 'small' ? 20 : 48} />
              </div>
            </div>
          )}
        </div>
      )}
      {card.icon && !card.image && !card.socialPlatform && (
        <div className="mb-4 text-5xl flex items-center justify-center">{card.icon}</div>
      )}

      {card.title && (
        <h3 className={`${card.size === 'small' ? 'text-sm' : 'text-lg'} font-semibold text-gunmetal dark:text-alice-blue ${card.size === 'small' ? 'mb-1' : 'mb-2'}`}>
          {card.title}
        </h3>
      )}

      {card.description && (
        <p className={`${card.size === 'small' ? 'text-xs' : 'text-sm'} text-gunmetal/60 dark:text-pale-sky/70 ${card.size === 'small' ? 'mb-2' : 'mb-4'} flex-grow leading-relaxed`}>
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

