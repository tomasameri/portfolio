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
  socialUsername?: string;
  image?: string;
  imageAsBackground?: boolean;
  icon?: string;
  order: number;
  // Campos de layout para React Grid Layout
  layoutX?: number;
  layoutY?: number;
  layoutW?: number;
  layoutH?: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to check if error is an authorization error
function isAuthError(error: any): boolean {
  if (!error) return false;
  
  // Check error code
  if (error.code === 401 || error.code === 403) {
    return true;
  }
  
  // Check error message
  if (error.message) {
    const message = error.message.toLowerCase();
    return (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('not authorized') ||
      message.includes('missing scopes') ||
      message.includes('missing scope')
    );
  }
  
  return false;
}

// Convertir documento de Appwrite a BentoCard
function documentToCard(doc: CardDocument): BentoCard {
  const card: BentoCard = {
    id: doc.$id,
    type: doc.type as BentoCard['type'],
    size: doc.size as BentoCard['size'],
    title: doc.title,
    description: doc.description,
    url: doc.url,
    socialPlatform: doc.socialPlatform as BentoCard['socialPlatform'],
    socialUsername: doc.socialUsername,
    image: doc.image,
    imageAsBackground: doc.imageAsBackground || false,
    icon: doc.icon,
  };
  
  // Agregar layout si existe
  if (doc.layoutX !== undefined && doc.layoutY !== undefined && doc.layoutW !== undefined && doc.layoutH !== undefined) {
    card.layout = {
      x: doc.layoutX,
      y: doc.layoutY,
      w: doc.layoutW,
      h: doc.layoutH,
      i: doc.$id,
    };
  }
  
  return card;
}

// Convertir BentoCard a documento de Appwrite
function cardToDocument(card: Partial<BentoCard>, order?: number): Partial<CardDocument> {
  const doc: Partial<CardDocument> = {
    type: card.type,
    size: card.size,
    order: order ?? 0,
  };
  
  // Solo agregar campos opcionales si tienen valor (no undefined ni null)
  if (card.title !== undefined && card.title !== null) doc.title = card.title;
  if (card.description !== undefined && card.description !== null) doc.description = card.description;
  if (card.url !== undefined && card.url !== null) doc.url = card.url;
  if (card.socialPlatform !== undefined && card.socialPlatform !== null) doc.socialPlatform = card.socialPlatform;
  if (card.socialUsername !== undefined && card.socialUsername !== null) doc.socialUsername = card.socialUsername;
  if (card.image !== undefined && card.image !== null) doc.image = card.image;
  if (card.imageAsBackground !== undefined && card.imageAsBackground !== null) doc.imageAsBackground = card.imageAsBackground;
  if (card.icon !== undefined && card.icon !== null && typeof card.icon === 'string') doc.icon = card.icon;
  
  return doc;
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
    // Si es un error de autorización (permisos), retornar array vacío silenciosamente
    if (isAuthError(error)) {
      return [];
    }
    
    // Si es un error de configuración, retornar array vacío
    if (error?.code === 0 || error?.message?.includes('Route not found')) {
      return [];
    }
    
    // Para otros errores, loguear y retornar array vacío
    console.error('Error fetching cards:', error);
    return [];
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
    
    // Mejorar mensaje de error para atributos faltantes
    if (error?.message?.includes('Unknown attribute')) {
      const attributeMatch = error.message.match(/Unknown attribute: "([^"]+)"/);
      const attribute = attributeMatch ? attributeMatch[1] : 'desconocido';
      throw new Error(
        `El atributo "${attribute}" no está definido en la colección de cards en Appwrite. ` +
        `Por favor, ve a Appwrite Console → Databases → Tu Base de Datos → Collections → cards → Attributes ` +
        `y crea el atributo "${attribute}". Consulta APPWRITE_SETUP.md para más detalles.`
      );
    }
    
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

// Actualizar layout de una card
export async function updateCardLayout(
  cardId: string,
  layout: { x: number; y: number; w: number; h: number }
): Promise<void> {
  try {
    const databaseId = getDatabaseId();
    const collectionId = getCardsCollectionId();
    
    if (!databaseId || !collectionId) {
      throw new Error('Database ID or Collection ID not configured');
    }

    await databases.updateDocument(
      databaseId,
      collectionId,
      cardId,
      {
        layoutX: layout.x,
        layoutY: layout.y,
        layoutW: layout.w,
        layoutH: layout.h,
      }
    );
  } catch (error) {
    console.error('Error updating card layout:', error);
    throw error;
  }
}