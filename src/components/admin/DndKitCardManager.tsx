'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { BentoCard, BentoCardSize } from '@/types/bento';
import { getCards, updateCard, createCard, deleteCard } from '@/lib/services/cardsService';
import CardEditor from './CardEditor';
import ConfirmationModal from './ConfirmationModal';
import BentoCardComponent from '@/components/BentoCard';
import { SIZE_TO_GRID } from '@/lib/grid-config';
import SocialIcon from '@/components/SocialIcon';
import SocialProfilePreview from '@/components/SocialProfilePreview';

// ─── Sortable Card Item ──────────────────────────────────────────────────

const sizeLabels: Record<BentoCardSize, string> = {
  small: 'Pequeña (1×1)',
  medium: 'Mediana (1×1)',
  large: 'Grande (2×2)',
  wide: 'Ancha (2×1)',
  tall: 'Alta (1×2)',
};

interface SortableCardItemProps {
  card: BentoCard;
  onEdit: (card: BentoCard) => void;
  onDelete: (id: string) => void;
  onSizeChange: (id: string, size: BentoCardSize) => void;
  isDraggingGrid: boolean;
}

function SortableCardItem({ card, onEdit, onDelete, onSizeChange, isDraggingGrid }: SortableCardItemProps) {
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // dnd-kit hooks
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
    gridColumn: `span ${Math.min(SIZE_TO_GRID[card.size]?.w || 1, 3)}`,
    gridRow: `span ${Math.min(SIZE_TO_GRID[card.size]?.h || 1, 3)}`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.size-selector-container') && !target.closest('.card-item-container')) {
        setShowSizeSelector(false);
        setIsSelected(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isBackgroundImage = card.image && (card.imageAsBackground || card.type === 'image');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card-item-container relative h-full w-full min-h-[160px] cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl scale-[1.02]' : ''}`}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Only select if not dragging the grid
        if (isDraggingGrid) return;
        setIsSelected(true);
      }}
    >
      {/* Action buttons (only show if selected) */}
      <div className={`absolute top-2 right-2 flex gap-2 transition-opacity z-40 pointer-events-auto ${isSelected && !isDragging ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(card); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-2 bg-cool-sky/90 backdrop-blur-sm text-gunmetal rounded-xl hover:bg-cool-sky shadow-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 shadow-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      {isSelected && !isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-40 size-selector-container pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); setShowSizeSelector(!showSizeSelector); }}
            onPointerDown={(e) => e.stopPropagation()}
             className="px-2 py-1 bg-cool-sky/90 backdrop-blur-sm text-gunmetal text-[10px] font-semibold rounded-full shadow-md flex items-center gap-1"
          >
            {sizeLabels[card.size].split(' ')[0]} ▾
          </button>
          {showSizeSelector && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gunmetal rounded-xl shadow-2xl overflow-hidden z-40 p-2 min-w-[150px]">
              {(Object.keys(sizeLabels) as BentoCardSize[]).map((size) => (
                <button
                  key={size}
                  onClick={(e) => { e.stopPropagation(); setShowSizeSelector(false); setIsSelected(false); onSizeChange(card.id, size); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full text-left px-3 py-2 hover:bg-dust-grey/10 text-xs rounded-lg"
                >
                  {sizeLabels[size]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visually replicate card content */}
      <div className="group relative h-full w-full pointer-events-none">
        <BentoCardComponent card={card} />
      </div>
    </div>
  );
}

// ─── Main DndKit Manager ─────────────────────────────────────────────────

export default function DndKitCardManager() {
  const [cards, setCards] = useState<BentoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<BentoCard | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [isDraggingGrid, setIsDraggingGrid] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to trigger drag (allows clicks to pass through)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    getCards().then(fetched => {
      // Sort natively by order parameter
      setCards(fetched.sort((a,b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDraggingGrid(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDraggingGrid(false);
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const newArray = arrayMove(items, oldIndex, newIndex);

        // Persist new order dynamically to Appwrite
        persistOrder(newArray);
        return newArray;
      });
    }
  };

  const persistOrder = async (sortedCards: BentoCard[]) => {
    setSavingLayout(true);
    try {
      await Promise.all(
        sortedCards.map((card, index) => updateCard(card.id, { order: index }))
      );
    } catch (e) {
      console.error('Failed to save order', e);
    } finally {
      setSavingLayout(false);
    }
  };

  // CRUD OPs
  const handleSizeChange = async (id: string, size: BentoCardSize) => {
     setCards(prev => prev.map(c => c.id === id ? { ...c, size } : c));
     await updateCard(id, { size });
  };
  const handleEdit = (c: BentoCard) => { setEditingCard(c); setIsEditorOpen(true); };
  const handleDelete = (id: string) => setCardToDelete(id);
  const handleCreate = () => { setEditingCard(undefined); setIsEditorOpen(true); };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold dark:text-alice-blue">Gestionar Cards (Dnd-Kit)</h2>
        <div className="flex gap-3">
           {savingLayout && <span className="text-sm text-cool-sky animate-pulse flex items-center">Guardando...</span>}
           <button onClick={handleCreate} className="px-4 py-2 bg-cool-sky text-gunmetal rounded-md">+ Nueva Card</button>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={cards.map(c => c.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[160px] gap-4 grid-flow-dense p-6 bg-white/50 dark:bg-gunmetal/30 rounded-2xl border-2 border-dashed border-dust-grey/30 dark:border-pale-sky/20 min-h-[400px]">
            {cards.map(card => (
              <SortableCardItem 
                 key={card.id} 
                 card={card} 
                 onEdit={handleEdit}
                 onDelete={handleDelete}
                 onSizeChange={handleSizeChange}
                 isDraggingGrid={isDraggingGrid}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <CardEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={async (data) => {
           if (editingCard) {
             const up = await updateCard(editingCard.id, data);
             setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...data, id: editingCard.id } : c));
           } else {
             const newC = await createCard(data, cards.length);
             setCards(prev => [...prev, newC]);
           }
           setIsEditorOpen(false);
        }} 
        card={editingCard} 
      />

      <ConfirmationModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={async () => {
          if (!cardToDelete) return;
          await deleteCard(cardToDelete);
          setCards(prev => prev.filter(c => c.id !== cardToDelete));
          setCardToDelete(null);
        }}
        title="Eliminar Card"
        message="¿Estás seguro? Esta acción no se puede deshacer."
      />
    </div>
  );
}
