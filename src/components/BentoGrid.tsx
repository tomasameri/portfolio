'use client';

import { motion } from 'framer-motion';
import { BentoCard as BentoCardType } from '@/types/bento';
import BentoCard from './BentoCard';
import { MOTION } from '@/lib/motion';
import { SIZE_TO_GRID } from '@/lib/grid-config';

interface BentoGridProps {
  cards: BentoCardType[];
}

export default function BentoGrid({ cards }: BentoGridProps) {
  // Sort cards by the persistent index (order) established in the dnd-kit admin builder
  const sortedCards = [...cards].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[160px] gap-4 grid-flow-dense w-full">
      {sortedCards.map((card, index) => {
        // Clamp grid span lengths based on config logic
        const spanW = Math.min(SIZE_TO_GRID[card.size]?.w || 1, 3);
        const spanH = Math.min(SIZE_TO_GRID[card.size]?.h || 1, 3);

        return (
          <div
            key={card.id}
            className="w-full h-full"
            style={{
              gridColumn: `span ${spanW}`,
              gridRow: `span ${spanH}`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...MOTION.spring,
                delay: index * 0.06,
              }}
              className="h-full w-full"
            >
              <BentoCard card={card} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
