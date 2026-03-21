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
    min-h-[140px] flex flex-col
  `;

  // Render social icon or platform preview
  const renderSocialContent = () => {
    if (!card.socialPlatform) return null;

    // Si hay imagen de fondo, mostrar solo el icono o badge minimalista
    if (isBackgroundImage) {
      return (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
            <SocialIcon platform={card.socialPlatform} size={20} />
          </div>
        </div>
      );
    }

    // Si NO hay imagen de fondo, mostrar preview completo
    return (
      <div className={`${card.size === 'small' ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'} flex flex-grow mb-4`}>
        {card.socialUsername ? (
          <SocialProfilePreview
            platform={card.socialPlatform}
            username={card.socialUsername}
            url={card.url}
            cardSize={card.size}
            customImage={card.image}
          />
        ) : (
          <div className={`${card.size === 'small' ? 'w-10 h-10' : 'w-24 h-24'} rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 flex items-center justify-center border-2 border-cool-sky/30 text-cool-sky`}>
            <SocialIcon platform={card.socialPlatform} size={card.size === 'small' ? 20 : 48} />
          </div>
        )}
      </div>
    );
  };

  const content = (
    <>
      {/* Background Image Layer */}
      {isBackgroundImage && card.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={card.size === 'large' || card.size === 'wide'}
          />
          {/* Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        </div>
      )}

      {/* Regular Image (Top) */}
      {card.image && !isBackgroundImage && (
        <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-dust-grey/20 dark:bg-pale-sky/10 flex-shrink-0">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content Layer */}
      <div className={`relative z-10 flex flex-col h-full ${card.size === 'small' ? 'p-4' : 'p-6'} ${isBackgroundImage ? 'justify-end text-white' : ''}`}>

        {/* Social Content (Icon/Preview) */}
        {renderSocialContent()}

        {/* Custom Icon (if no social/image) */}
        {card.icon && !card.image && !card.socialPlatform && (
          <div className={`mb-auto text-gunmetal dark:text-alice-blue ${card.size === 'small' ? 'text-3xl' : 'text-5xl'} flex items-center justify-center mt-2`}>
            {card.icon}
          </div>
        )}

        {/* Text Content */}
        <div className={isBackgroundImage ? '' : 'mt-auto'}>
          {card.title && (
            <h3 className={`${card.size === 'small' ? 'text-sm' : 'text-lg'} font-bold leading-tight mb-1 ${isBackgroundImage ? 'text-white drop-shadow-md' : 'text-gunmetal dark:text-alice-blue'}`}>
              {card.title}
            </h3>
          )}

          {card.description && (
            <p className={`${card.size === 'small' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'} leading-relaxed ${isBackgroundImage ? 'text-white/90 drop-shadow-sm' : 'text-gunmetal/60 dark:text-pale-sky/70'}`}>
              {card.description}
            </p>
          )}

          {card.content && (
            <div className="mt-2 text-sm">{card.content}</div>
          )}
        </div>
      </div>
    </>
  );

  if (card.url) {
    return (
      <Link
        href={card.url}
        target={card.url.startsWith('http') ? '_blank' : '_self'}
        rel={card.url.startsWith('http') ? 'noopener noreferrer' : ''}
        className={baseClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
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

