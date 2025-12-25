'use client';

import { CardGroup as CardGroupType } from '@/types/bento';
import BentoCard from './BentoCard';

interface CardGroupProps {
  group: CardGroupType;
  onOpen: (group: CardGroupType) => void;
}

export default function CardGroup({ group, onOpen }: CardGroupProps) {
  const previewCards = group.cards.slice(0, group.previewCards || 4);
  const remainingCount = group.cards.length - previewCards.length;

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{group.icon}</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {group.title}
          </h3>
        </div>
        {remainingCount > 0 && (
          <button
            onClick={() => onOpen(group)}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Ver todo ({group.cards.length})
          </button>
        )}
      </div>

      {/* Preview Cards Grid - Estilo iOS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {previewCards.map((card) => (
          <div
            key={card.id}
            onClick={(e) => {
              e.stopPropagation();
              if (card.url && card.url !== '#') {
                if (card.url.startsWith('http')) {
                  window.open(card.url, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = card.url;
                }
              } else {
                onOpen(group);
              }
            }}
            className="cursor-pointer"
          >
            <BentoCard card={{ ...card, size: 'small' }} />
          </div>
        ))}
        
        {/* Show More Button - Estilo iOS */}
        {remainingCount > 0 && (
          <button
            onClick={() => onOpen(group)}
            className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group active:scale-95"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              {group.icon}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              +{remainingCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

