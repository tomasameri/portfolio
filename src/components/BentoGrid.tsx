'use client';

import { BentoCard as BentoCardType } from '@/types/bento';
import BentoCard from './BentoCard';

interface BentoGridProps {
  cards: BentoCardType[];
}

export default function BentoGrid({ cards }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
      {cards.map((card) => (
        <BentoCard key={card.id} card={card} />
      ))}
    </div>
  );
}

