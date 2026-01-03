import { databases, getDatabaseId, getCardsCollectionId, ID } from '../appwrite';
import { BentoCard } from '@/types/bento';

export interface CardDocument {
  $id: string;
  type: string;
  size: string;
  title?: string;
  description?: string;
  url?: string;
  socialPlatform?: string;
  image?: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Convertir documento de Appwrite a BentoCard
function documentToCard(doc: CardDocument): BentoCard {
  return {
    id: doc.$id,
    type: doc.type as BentoCard['type'],
    size: doc.size as BentoCard['size'],
    title: doc.title,
    description: doc.description,
    url: doc.url,
    socialPlatform: doc.socialPlatform as BentoCard['socialPlatform'],
    image: doc.image,
    icon: doc.icon,
  };
}

// Convertir BentoCard a documento de Appwrite
function cardToDocument(card: Partial<BentoCard>, order?: number): Partial<CardDocument> {
  return {
    type: card.type,
    size: card.size,
    title: card.title,
    description: card.description,
    url: card.url,
    socialPlatform: card.socialPlatform,
    image: card.image,
    icon: typeof card.icon === 'string' ? card.icon : undefined,
    order: order ?? 0,
  };
}

// Obtener todas las cards ordenadas
export async function getCards(): Promise<BentoCard[]> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      // Silenciosamente retornar array vacío si no está configurado
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [/* queries */]
    );

    const cards = response.documents as unknown as CardDocument[];
    // Ordenar por el campo 'order'
    cards.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return cards.map(documentToCard);
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      console.warn('Appwrite not configured or route not found. Returning empty array.');
      return [];
    }
    throw error;
  }
}

// Crear nueva card
export async function createCard(card: Omit<BentoCard, 'id'>, order: number): Promise<BentoCard> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error(`Database ID or Collection ID not configured. Database: ${databaseId || 'missing'}, Collection: ${collectionId || 'missing'}`);
    }

    const document = cardToDocument(card, order);
    
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      document as any
    );

    return documentToCard(response as unknown as CardDocument);
  } catch (error: any) {
    console.error('Error creating card:', error);
    if (error.code === 404) {
      const databaseId = getDatabaseId();
      const collectionId = getCardsCollectionId();
      throw new Error(`Route not found. Check that collection "${collectionId}" exists in database "${databaseId}". Original error: ${error.message}`);
    }
    throw error;
  }
}

// Actualizar card existente
export async function updateCard(cardId: string, updates: Partial<BentoCard>): Promise<BentoCard> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    const document = cardToDocument(updates);
    
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      cardId,
      document as any
    );

    return documentToCard(response as unknown as CardDocument);
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
}

// Eliminar card
export async function deleteCard(cardId: string): Promise<void> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    await databases.deleteDocument(
      databaseId,
      collectionId,
      cardId
    );
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
}

// Reordenar cards (actualizar el campo order de múltiples cards)
export async function reorderCards(cardOrders: { cardId: string; order: number }[]): Promise<void> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    const promises = cardOrders.map(({ cardId, order }) =>
      databases.updateDocument(
        databaseId,
        collectionId,
        cardId,
        { order }
      )
    );

    await Promise.all(promises);
  } catch (error) {
    console.error('Error reordering cards:', error);
    throw error;
  }
}