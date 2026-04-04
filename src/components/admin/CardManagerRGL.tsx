'use client';

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { BentoCardSize } from '@/types/bento';
import { Responsive, Layout, LayoutItem, ResponsiveLayouts } from 'react-grid-layout';
import { BentoCard, CardLayout } from '@/types/bento';
import { useWidth } from '@/hooks/useWidth';
import { GRID_CONFIG, SIZE_TO_GRID } from '@/lib/grid-config';
import { buildLgLayout, deriveResponsiveLayouts } from '@/lib/grid-packer';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  updateCardLayout,
} from '@/lib/services/cardsService';
import CardEditor from './CardEditor';
import ConfirmationModal from './ConfirmationModal';
import SocialIcon from '@/components/SocialIcon';
import SocialProfilePreview from '@/components/SocialProfilePreview';
import BentoCardComponent from '@/components/BentoCard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// ─── Constants ───────────────────────────────────────────────────────────

const ADMIN_CONTAINER_PADDING: [number, number] = [20, 20];

// ─── CardItem sub-component ──────────────────────────────────────────────

const sizeLabels: Record<BentoCardSize, string> = {
  small: 'Pequeña (1×1)',
  medium: 'Mediana (1×1)',
  large: 'Grande (2×2)',
  wide: 'Ancha (2×1)',
  tall: 'Alta (1×2)',
};

interface CardItemProps {
  card: BentoCard;
  onEdit: (card: BentoCard) => void;
  onDelete: (cardId: string) => void;
  onSizeChange?: (cardId: string, newSize: BentoCardSize) => void;
}

const CardItem = memo(function CardItem({ card, onEdit, onDelete, onSizeChange }: CardItemProps) {
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.size-selector-container') && !target.closest('.card-item-container')) {
        setShowSizeSelector(false);
        setIsCardSelected(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSizeSelect = (newSize: BentoCardSize) => {
    setShowSizeSelector(false);
    setIsCardSelected(false);
    onSizeChange?.(card.id, newSize);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.size-selector-container')) return;
    setIsCardSelected(true);
  };

  const isBackgroundImage = card.image && (card.imageAsBackground || card.type === 'image');

  return (
    <div
      className="relative group h-full w-full card-item-container"
      style={{ overflow: 'visible' }}
      onClick={handleCardClick}
    >
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(card); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="no-drag p-2 bg-cool-sky/90 backdrop-blur-sm text-gunmetal rounded-xl hover:bg-cool-sky shadow-lg transition-all duration-200"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="no-drag p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 shadow-lg transition-all duration-200"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Size selector pill — visible only when card is selected */}
      {isCardSelected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-40 size-selector-container pointer-events-auto">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSizeSelector(!showSizeSelector); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="no-drag px-2 py-1 bg-cool-sky/90 backdrop-blur-sm text-gunmetal text-[10px] font-semibold rounded-full hover:bg-cool-sky shadow-md transition-all duration-200 flex items-center gap-1"
              title="Cambiar tamaño"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="whitespace-nowrap">
                {sizeLabels[card.size].split(' ')[0]}
              </span>
              <svg className={`w-2 h-2 transition-transform ${showSizeSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Size dropdown — opens upward */}
            {showSizeSelector && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gunmetal rounded-xl shadow-2xl border border-dust-grey/30 dark:border-pale-sky/20 overflow-hidden z-40 min-w-[200px] p-2">
                {(Object.keys(sizeLabels) as BentoCardSize[]).map((size) => {
                  const dimensions = SIZE_TO_GRID[size];
                  const isSelected = card.size === size;
                  return (
                    <button
                      key={size}
                      onClick={(e) => { e.stopPropagation(); handleSizeSelect(size); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 ${isSelected
                        ? 'bg-cool-sky/20 text-cool-sky font-semibold border border-cool-sky/40'
                        : 'text-gunmetal dark:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 border border-transparent'
                        }`}
                    >
                      {/* Visual preview of size */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0" style={{ width: `${dimensions.w * 12 + (dimensions.w - 1) * 2}px` }}>
                        {Array.from({ length: dimensions.h }).map((_, row) => (
                          <div key={row} className="flex gap-0.5">
                            {Array.from({ length: dimensions.w }).map((_, col) => (
                              <div
                                key={col}
                                className={`w-3 h-3 rounded-sm ${isSelected ? 'bg-cool-sky' : 'bg-dust-grey/40 dark:bg-pale-sky/30'}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium">{sizeLabels[size]}</div>
                        <div className="text-[10px] text-gunmetal/60 dark:text-pale-sky/60">
                          {dimensions.w}×{dimensions.h} grid
                        </div>
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4 text-cool-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="pointer-events-none h-full w-full">
        <BentoCardComponent card={card} />
      </div>
    </div>
  );
});

// ─── Main component ──────────────────────────────────────────────────────

export default function CardManagerRGL() {
  const [cards, setCards] = useState<BentoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<BentoCard | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [layouts, setLayouts] = useState<ResponsiveLayouts>({ lg: [], md: [], sm: [], xs: [] });
  const [savingLayout, setSavingLayout] = useState(false);
  const { width, containerRef, mounted } = useWidth();

  // ── Keep a ref to the latest lg layout for use in callbacks ──
  const lgLayoutRef = useRef<LayoutItem[]>([]);
  useEffect(() => {
    lgLayoutRef.current = (layouts.lg || []) as LayoutItem[];
  }, [layouts]);

  // ── Guards to prevent layout reset on mount / breakpoint transitions ──
  const isInitialMount = useRef(true);
  const currentBreakpoint = useRef('lg');

  // ── Initial data load ──
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      isInitialMount.current = true; // Gate onLayoutChange while we set up
      const fetchedCards = await getCards();
      setCards(fetchedCards);

      const lgLayout = buildLgLayout(fetchedCards, {
        extraProps: { minW: 1, maxW: GRID_CONFIG.cols.lg, minH: 1, maxH: 3 },
      });
      setLayouts(deriveResponsiveLayouts(lgLayout));

      // Allow onLayoutChange to run only after RGL has rendered with our layout
      requestAnimationFrame(() => {
        isInitialMount.current = false;
      });
    } catch (error) {
      console.error('Error loading cards:', error);
      alert('Error al cargar las cards');
    } finally {
      setLoading(false);
    }
  };

  // ── Persist ALL card positions to DB and sync local cards state ──
  const persistLayout = useCallback(async (layout: LayoutItem[]) => {
    setSavingLayout(true);
    try {
      const clampedLayout = layout.map(item => ({
        i: item.i,
        x: Math.max(0, Math.min(10, Math.round(item.x))),
        y: Math.max(0, Math.min(100, Math.round(item.y))),
        w: Math.max(1, Math.min(GRID_CONFIG.cols.lg, Math.round(item.w))),
        h: Math.max(1, Math.min(3, Math.round(item.h))),
      }));

      await Promise.all(
        clampedLayout.map(item =>
          updateCardLayout(item.i, {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          })
        )
      );

      // Keep card.layout in sync so future buildLgLayout calls use fresh positions
      setCards(prev =>
        prev.map(card => {
          const item = clampedLayout.find(l => l.i === card.id);
          if (!item) return card;
          return {
            ...card,
            layout: { x: item.x, y: item.y, w: item.w, h: item.h, i: card.id },
          };
        })
      );
    } catch (err) {
      console.error('Failed to persist layout:', err);
    } finally {
      setSavingLayout(false);
    }
  }, []);

  const isDraggingRef = useRef(false);
  // Track whether the user actually dragged (vs RGL internal recalculates)
  const hasDraggedRef = useRef(false);

  // ── Sync local state without destroying RGL during active drags ──
  const handleLayoutChange = useCallback(
    (_currentLayout: Layout, allLayouts: ResponsiveLayouts) => {
      // Skip on initial mount or while dragging
      if (isInitialMount.current) return;
      if (isDraggingRef.current) return;
      // Only update local state but DON'T persist — persisting happens in onDragStop
      if (allLayouts && Object.keys(allLayouts).length > 0) {
        setLayouts(allLayouts);
      }
    },
    []
  );

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
  }, []);

  const handleDragStop = useCallback((_layout: any, _oldItem: any, newItem: any) => {
    isDraggingRef.current = false;
    hasDraggedRef.current = true;
    // RGL fires onLayoutChange right after this with the final positions — 
    // we need to persist THOSE positions, so we do it here with a short delay
    // to let the layout state update first
    setTimeout(() => {
      const currentLg = lgLayoutRef.current;
      if (currentLg.length > 0) {
        persistLayout([...currentLg]);
      }
    }, 50);
  }, [persistLayout]);

  // ── Track breakpoint changes ──
  const handleBreakpointChange = useCallback((newBreakpoint: string) => {
    currentBreakpoint.current = newBreakpoint;
  }, []);

  // ── Card CRUD ──

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
        // Update existing card content — keep its layout position
        const updatedCard = await updateCard(editingCard.id, cardData);

        // If the size changed, update its grid dimensions in the layout
        const newDims = SIZE_TO_GRID[cardData.size] || { w: 1, h: 1 };
        const oldDims = SIZE_TO_GRID[editingCard.size] || { w: 1, h: 1 };
        const sizeChanged = newDims.w !== oldDims.w || newDims.h !== oldDims.h;

        // Update local cards state immediately (no refetch)
        setCards(prev =>
          prev.map(c => c.id === editingCard.id ? { ...c, ...cardData, id: editingCard.id } : c)
        );

        if (sizeChanged) {
          // Update the layout dimensions for this card
          const currentLg = lgLayoutRef.current;
          const updatedLg = currentLg.map(item =>
            item.i === editingCard.id
              ? { ...item, w: newDims.w, h: newDims.h }
              : item
          );
          setLayouts(deriveResponsiveLayouts(updatedLg));
          await persistLayout(updatedLg);
        }
      } else {
        // Create a new card
        const maxOrder = cards.length > 0 ? Math.max(...cards.map((_, i) => i)) : -1;
        const newCard = await createCard(cardData, maxOrder + 1);

        // Add to local state
        setCards(prev => [...prev, newCard]);

        // Append to layout: place below existing content
        const currentLg = lgLayoutRef.current;
        let maxY = 0;
        for (const item of currentLg) {
          maxY = Math.max(maxY, item.y + item.h);
        }
        const dims = SIZE_TO_GRID[newCard.size] || { w: 1, h: 1 };
        const newItem: LayoutItem = {
          i: newCard.id,
          x: 0,
          y: maxY,
          w: dims.w,
          h: dims.h,
          minW: 1,
          maxW: GRID_CONFIG.cols.lg,
          minH: 1,
          maxH: 3,
        };
        const updatedLg = [...currentLg, newItem];
        setLayouts(deriveResponsiveLayouts(updatedLg));
        await persistLayout(updatedLg);
      }
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  };

  // ── Delete ──

  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const handleRequestDelete = (cardId: string) => {
    setCardToDelete(cardId);
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      await deleteCard(cardToDelete);

      // Remove from local state (no refetch)
      setCards(prev => prev.filter(c => c.id !== cardToDelete));

      // Remove from layout
      const currentLg = lgLayoutRef.current;
      const updatedLg = currentLg.filter(item => item.i !== cardToDelete);
      setLayouts(deriveResponsiveLayouts(updatedLg));

      setCardToDelete(null);
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error al eliminar la card');
    }
  };

  // ── Size change (from the card's size selector) ──

  const handleSizeChange = async (cardId: string, newSize: BentoCardSize) => {
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      const newDims = SIZE_TO_GRID[newSize] || { w: 1, h: 1 };

      // 1. Persist the new size to DB
      await updateCard(cardId, { size: newSize });

      // 2. Update local cards state
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, size: newSize } : c));

      // 3. Update layout dimensions and persist
      const currentLg = lgLayoutRef.current;
      const updatedLg = currentLg.map(item =>
        item.i === cardId
          ? { ...item, w: newDims.w, h: newDims.h }
          : item
      );
      setLayouts(deriveResponsiveLayouts(updatedLg));
      await persistLayout(updatedLg);
    } catch (error) {
      console.error('Error updating card size:', error);
      alert('Error al actualizar el tamaño de la card');
    }
  };

  const memoizedGridChildren = useMemo(() => {
    return cards.map((card) => (
      <div
        key={card.id}
        className="bg-transparent overflow-visible group-card-wrapper"
      >
        <CardItem
          card={card}
          onEdit={handleEdit}
          onDelete={handleRequestDelete}
          onSizeChange={handleSizeChange}
        />
      </div>
    ));
    // We intentionally omit handleEdit, onDelete, and handleSizeChange from deps.
    // They are stable via their internal functional state architectures (`setCards(prev => ...)`).
    // `cards` array mutation is the only thing that should rebuild the DOM matrices.
  }, [cards]);

  // ── Render ──

  if (!mounted) return null;

  if (loading && cards.length === 0) {
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
        <div className="flex gap-3 items-center">
          {savingLayout && (
            <span className="text-sm text-cool-sky animate-pulse">
              Guardando layout...
            </span>
          )}
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors"
          >
            + Nueva Card
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-white/50 dark:bg-gunmetal/30 rounded-2xl p-6 border-2 border-dashed border-dust-grey/30 dark:border-pale-sky/20 min-h-[600px]"
        style={{ overflow: 'visible' }}
      >
        <Responsive
          className="layout"
          layouts={layouts}
          width={width}
          breakpoints={GRID_CONFIG.breakpoints}
          cols={GRID_CONFIG.cols}
          rowHeight={GRID_CONFIG.rowHeight}
          margin={GRID_CONFIG.margin}
          containerPadding={ADMIN_CONTAINER_PADDING}
          measureBeforeMount={true}
          {...({
            compactType: GRID_CONFIG.compactType,
            preventCollision: false,
            useCSSTransforms: true,
            isDraggable: true,
            isResizable: false,
            isBounded: false,
            allowOverlap: false,
            draggableCancel: '.no-drag, button, .size-selector-container',
            onDragStart: (layout: any, oldItem: any, newItem: any) => {
              handleDragStart();
            },
            onDrag: (layout: any, oldItem: any, newItem: any) => {
              // Intentionally blank
            },
            onDragStop: (layout: any, oldItem: any, newItem: any) => {
               handleDragStop(layout, oldItem, newItem);
            },
            onLayoutChange: (currentLayout: LayoutItem[], allLayouts: ResponsiveLayouts) => {
               handleLayoutChange(currentLayout, allLayouts);
            },
            onBreakpointChange: (newBreakpoint: string) => {
               handleBreakpointChange(newBreakpoint);
            },
          } as any)}
        >
          {memoizedGridChildren}
        </Responsive>
      </div>

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

      <ConfirmationModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Card"
        message="¿Estás seguro de que quieres eliminar esta card? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDangerous={true}
      />
    </div>
  );
}
