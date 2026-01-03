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
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-gunmetal dark:text-pale-sky">{messages.home.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-red-500">{messages.home.error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <Sidebar />

          {/* Bento Grid */}
          <div className="flex-1">
            {cards.length > 0 ? (
              <BentoGrid cards={cards} />
            ) : !loading ? (
              <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
                <p className="mb-2">{messages.home.noCards}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}