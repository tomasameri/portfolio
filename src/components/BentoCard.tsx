'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BentoCard as BentoCardType } from '@/types/bento';
import SocialIcon from './SocialIcon';
import SocialProfilePreview from './SocialProfilePreview';

interface BentoCardProps {
  card: BentoCardType;
}

export default function BentoCard({ card }: BentoCardProps) {
  const isBackgroundImage = card.image && (card.imageAsBackground || card.type === 'image');
  
  const getSocialColor = (platform?: string) => {
    switch (platform) {
      case 'github': return '#24292e';
      case 'linkedin': return '#0077b5';
      case 'twitter': return '#14171a';
      case 'instagram': return '#e1306c';
      case 'youtube': return '#ff0000';
      case 'tiktok': return '#000000';
      default: return undefined;
    }
  };

  const overrideColor = card.color || (card.type === 'social' ? getSocialColor(card.socialPlatform) : undefined);
  const isDarkForeground = isBackgroundImage || !!overrideColor;

  // ─── Editorial tonal styling (no borders, no heavy shadows) ───
  const baseClasses = `
    group relative overflow-hidden rounded-[1.5rem]
    ${overrideColor ? '' : isBackgroundImage ? '' : 'bg-surface-container-high'}
    transition-colors duration-300
    ${overrideColor ? 'hover:brightness-110' : 'hover:bg-surface-container-highest'}
    h-full w-full
    min-h-[140px] flex flex-col
  `;

  if (card.type === 'social' && card.socialPlatform) {
    const brandColor = getSocialColor(card.socialPlatform);
    const bgColor = card.color || undefined;

    // Auto-generate URL from handle if no explicit URL is set
    const getAutoUrl = (platform: string, username: string): string => {
      const handle = username.replace('@', '');
      switch (platform) {
        case 'github':    return `https://github.com/${handle}`;
        case 'linkedin':  return `https://linkedin.com/in/${handle}`;
        case 'twitter':   return `https://twitter.com/${handle}`;
        case 'instagram': return `https://instagram.com/${handle}`;
        case 'tiktok':    return `https://tiktok.com/@${handle}`;
        case 'youtube':   return `https://youtube.com/@${handle}`;
        default:          return '';
      }
    };

    const resolvedUrl = card.url || (card.socialUsername ? getAutoUrl(card.socialPlatform, card.socialUsername) : '');

    if (card.size === 'small') {
      const inner = (
        <div className="flex flex-col h-full w-full justify-center items-center text-center">
          <div 
             className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white mb-3 shadow-sm ring-1 ring-white/10 shrink-0 group-hover:scale-110 transition-transform"
             style={{ backgroundColor: brandColor }}
           >
             <SocialIcon platform={card.socialPlatform} size={22} />
           </div>
           <span className="font-label text-[0.6rem] tracking-widest text-on-surface-variant uppercase mb-0.5">
             {card.socialPlatform}
           </span>
           <span className="font-body font-bold text-[13px] text-on-surface max-w-full truncate px-2">
             {card.title || `@${(card.socialUsername || '').replace('@','')}`}
           </span>
        </div>
      );
      const baseClassesSmall = `group relative h-full w-full p-4 overflow-hidden rounded-[1.5rem] transition-colors duration-300 ring-1 ring-on-surface-muted/10 flex flex-col justify-center items-center ${bgColor ? 'hover:brightness-95' : 'bg-surface-container-high hover:bg-surface-container-highest'}`;
      if (resolvedUrl) {
        return <Link href={resolvedUrl} target="_blank" rel="noopener noreferrer" className={baseClassesSmall} style={bgColor ? { backgroundColor: bgColor } : {}}>{inner}</Link>;
      }
      return <div className={baseClassesSmall} style={bgColor ? { backgroundColor: bgColor } : {}}>{inner}</div>;
    }

    // Medium / Large / Wide / Tall — horizontal layout: logo left, text right
    const inner = (
      <div className="flex flex-col h-full">
        {/* Top row: logo + text */}
        <div className="flex items-start gap-3 md:gap-4">
          <div 
            className="w-11 h-11 md:w-12 md:h-12 rounded-[14px] flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            <SocialIcon platform={card.socialPlatform} size={26} />
          </div>
          <div className="flex flex-col min-w-0 flex-1 pt-0.5">
            <h3 className="text-[15px] md:text-[16px] font-bold text-on-surface leading-tight tracking-tight truncate">
              {card.title || card.socialUsername?.replace('@', '') || card.socialPlatform}
            </h3>
            {(card.description || card.socialUsername) && (
              <p className="text-[12px] md:text-[13px] text-on-surface-variant mt-0.5 font-medium truncate">
                {card.description || `@${(card.socialUsername || '').replace('@', '')}`}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    const baseClassesSocial = `group relative h-full w-full p-4 md:p-5 overflow-hidden rounded-[1.5rem] transition-colors duration-300 ring-1 ring-on-surface-muted/10 flex flex-col ${bgColor ? 'hover:brightness-95' : 'bg-surface-container-high hover:bg-surface-container-highest'}`;
    if (resolvedUrl) {
      return <Link href={resolvedUrl} target="_blank" rel="noopener noreferrer" className={baseClassesSocial} style={bgColor ? { backgroundColor: bgColor } : {}}>{inner}</Link>;
    }
    return <div className={baseClassesSocial} style={bgColor ? { backgroundColor: bgColor } : {}}>{inner}</div>;
  }

  const renderSocialContent = () => {
    if (!card.socialPlatform) return null;

    if (isBackgroundImage) {
      return (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-[20px] flex items-center justify-center text-white border border-white/10">
            <SocialIcon platform={card.socialPlatform} size={20} />
          </div>
        </div>
      );
    }

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
          <div className={`${card.size === 'small' ? 'w-10 h-10' : 'w-24 h-24'} rounded-full bg-accent-container flex items-center justify-center text-accent`}>
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
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={card.size === 'large' || card.size === 'wide'}
          />
          {/* Gradient overlay — cinematic, editorial */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
        </div>
      )}

      {/* Regular Image (Top) */}
      {card.image && !isBackgroundImage && (
        <div className="relative w-full h-32 mb-0 overflow-hidden bg-surface-container flex-shrink-0 rounded-t-[1.5rem]">
          <Image
            src={card.image}
            alt={card.title || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      {/* Content Layer */}
      <div className={`relative z-10 flex flex-col h-full ${card.size === 'small' ? 'p-4' : 'p-6'} ${isBackgroundImage ? 'justify-end' : ''} ${isDarkForeground ? 'text-white' : ''}`}>

        {/* Social Content */}
        {renderSocialContent()}

        {/* Custom Icon / Link Indicator */}
        {card.type === 'link' && !isBackgroundImage && (
          <div className="absolute top-6 right-6 text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </div>
        )}
        {card.icon && !card.image && !card.socialPlatform && (
          <div className={`mb-auto text-on-surface ${card.size === 'small' ? 'text-3xl' : 'text-5xl'} flex items-center justify-center mt-2`}>
            {card.icon}
          </div>
        )}

        {/* Text — Editorial typography */}
        <div className={isBackgroundImage ? '' : 'mt-auto'}>
          {card.title && (
            <h3 className={`
              font-display leading-tight mb-1
              ${card.size === 'small' ? 'text-headline-sm' : 'text-headline-md'}
              ${isDarkForeground ? 'text-white drop-shadow-md' : 'text-on-surface'}
            `}>
              {card.title}
            </h3>
          )}

          {card.description && (
            <p className={`
              font-body leading-relaxed
              ${card.size === 'small' ? 'text-body-sm line-clamp-2' : 'text-body-sm line-clamp-3'}
              ${isDarkForeground ? 'text-white/85' : 'text-on-surface-variant'}
            `}>
              {card.description}
            </p>
          )}

          {card.content && (
            <div className="mt-2 font-body text-body-sm">{card.content}</div>
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
        style={overrideColor ? { backgroundColor: overrideColor } : {}}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses} style={overrideColor ? { backgroundColor: overrideColor } : {}}>
      {content}
    </div>
  );
}
