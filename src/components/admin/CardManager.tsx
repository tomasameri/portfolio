'use client';

import { useState, useEffect } from 'react';
import { BentoCard } from '@/types/bento';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from '@/lib/services/cardsService';
import CardEditor from './CardEditor';
import CardPreview from './CardPreview';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCardItemProps {
  card: BentoCard;
  onEdit: (card: BentoCard) => void;
  onDelete: (cardId: string) => void;
}

function SortableCardItem({ card, onEdit, onDelete }: SortableCardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit(card)}
          className="p-1 bg-cool-sky text-gunmetal rounded hover:bg-cool-sky/90"
          title="Editar"
        >
          ✏️
        </button>
        <button
          onClick={() => {
            if (confirm('¿Estás seguro de eliminar esta card?')) {
              onDelete(card.id);
            }
          }}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-2 bg-alice-blue dark:bg-pale-sky/10 rounded-lg border border-dust-grey/30 dark:border-pale-sky/20 hover:border-cool-sky/40 dark:hover:border-cool-sky/30 transition-all"
      >
        <CardPreview card={card} />
      </div>
    </div>
  );
}

export default function CardManager() {
  const [cards, setCards] = useState<BentoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<BentoCard | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await getCards();
      setCards(fetchedCards);
    } catch (error) {
      console.error('Error loading cards:', error);
      alert('Error al cargar las cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCard(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (card: BentoCard) => {
    setEditingCard(card);
    setIsEditorOpen(true);
  };

  const handleSave = async (cardData: Omit<BentoCard, 'id'>) => {
    try {
      if (editingCard) {
        await updateCard(editingCard.id, cardData);
      } else {
        const maxOrder = cards.length > 0 ? Math.max(...cards.map((c, i) => i)) : -1;
        await createCard(cardData, maxOrder + 1);
      }
      await loadCards();
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  };

  const handleDelete = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      await loadCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error al eliminar la card');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);

      const newCards = arrayMove(cards, oldIndex, newIndex);
      setCards(newCards);

      // Actualizar orden en la base de datos
      const orders = newCards.map((card, index) => ({
        cardId: card.id,
        order: index,
      }));

      try {
        await reorderCards(orders);
      } catch (error) {
        console.error('Error reordering cards:', error);
        // Revertir cambios locales si falla
        await loadCards();
        alert('Error al reordenar las cards');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gunmetal dark:text-pale-sky">Cargando cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gunmetal dark:text-alice-blue">
          Gestionar Cards
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors"
        >
          + Nueva Card
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <SortableCardItem
                key={card.id}
                card={card}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {cards.length === 0 && (
        <div className="text-center py-12 text-gunmetal/70 dark:text-pale-sky/70">
          No hay cards. Crea una nueva para comenzar.
        </div>
      )}

      <CardEditor
        card={editingCard}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

