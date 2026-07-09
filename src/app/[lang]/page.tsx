// src/app/[lang]/page.tsx
import { getCards } from '@/lib/services/cardsService';
import HomeClient from './HomeClient';

// Renderizado en servidor con ISR: el contenido (cards) viaja en el HTML inicial
// para que Google lo indexe sin depender de JS. Se refresca cada hora.
export const revalidate = 3600;

export default async function Home() {
  const cards = await getCards();
  return <HomeClient cards={cards} />;
}
