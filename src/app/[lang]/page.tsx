// src/app/[lang]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from "@/context/LocaleContext";
import Sidebar from "@/components/Sidebar";
import BentoGrid from "@/components/BentoGrid";
import { BentoCard } from "@/types/bento";
import { getCards } from "@/lib/services/cardsService";

export default function Home() {
  const { locale, messages } = useLocale();
  const [cards, setCards] = useState<BentoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCards = await getCards();
      setCards(fetchedCards);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Error al cargar las cards');
      // Fallback a cards vacías en caso de error
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="text-on-surface-muted font-body animate-pulse">{messages.home.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="text-red-500 font-body">{messages.home.error}</div>
      </div>
    );
  }

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
            ) : !loading ? (
              <div className="text-center py-24 text-on-surface-muted">
                <p className="mb-2 font-body text-body-lg">{messages.home.noCards}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}