'use client';

import { useLocale } from '@/context/LocaleContext';
import Sidebar from '@/components/Sidebar';
import BentoGrid from '@/components/BentoGrid';
import { BentoCard } from '@/types/bento';

export default function HomeClient({ cards }: { cards: BentoCard[] }) {
  const { messages } = useLocale();

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Sidebar */}
          <Sidebar />

          {/* Bento Grid */}
          <div className="flex-1">
            {cards.length > 0 ? (
              <BentoGrid cards={cards} />
            ) : (
              <div className="text-center py-24 text-on-surface-muted">
                <p className="mb-2 font-body text-body-lg">{messages.home.noCards}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
