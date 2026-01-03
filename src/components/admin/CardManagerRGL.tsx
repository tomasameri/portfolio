'use client';

import { useState, useEffect, useCallback } from 'react';
import { BentoCardSize } from '@/types/bento';
import { Responsive, Layout, LayoutItem, ResponsiveLayouts } from 'react-grid-layout';
import { BentoCard, CardLayout } from '@/types/bento';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  updateCardLayout,
} from '@/lib/services/cardsService';
import CardEditor from './CardEditor';
import SocialIcon from '@/components/SocialIcon';
import SocialProfilePreview from '@/components/SocialProfilePreview';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Mapeo de tamaños a dimensiones de grid
const sizeToGridDimensions: Record<string, { w: number; h: number }> = {
  small: { w: 1, h: 1 },
  medium: { w: 1, h: 1 },
  large: { w: 2, h: 2 },
  wide: { w: 2, h: 1 },
  tall: { w: 1, h: 2 },
};

// Convertir tamaño a layout inicial con algoritmo mejorado
function sizeToLayout(card: BentoCard, index: number, existingLayouts: CardLayout[] = []): CardLayout {
  // Si ya tiene layout guardado, usarlo
  if (card.layout) {
    return card.layout;
  }
  
  // Generar layout basado en tamaño y orden
  const dimensions = sizeToGridDimensions[card.size] || { w: 1, h: 1 };
  const cols = 3; // Columnas del grid
  
  // Calcular posición inicial evitando colisiones
  let x = 0;
  let y = 0;
  let placed = false;
  
  // Buscar la primera posición disponible
  while (!placed) {
    // Verificar si esta posición está libre
    const collision = existingLayouts.some(existing => {
      const ex = existing.x;
      const ey = existing.y;
      const ew = existing.w;
      const eh = existing.h;
      
      // Verificar colisión
      return (
        x < ex + ew &&
        x + dimensions.w > ex &&
        y < ey + eh &&
        y + dimensions.h > ey
      );
    });
    
    if (!collision && x + dimensions.w <= cols) {
      placed = true;
    } else {
      // Mover a la siguiente posición
      x += dimensions.w;
      if (x + dimensions.w > cols) {
        x = 0;
        y += dimensions.h;
      }
    }
    
    // Prevenir loop infinito
    if (y > 50) {
      placed = true;
    }
  }
  
  return {
    x,
    y,
    w: dimensions.w,
    h: dimensions.h,
    i: card.id,
  };
}

interface CardItemProps {
  card: BentoCard;
  onEdit: (card: BentoCard) => void;
  onDelete: (cardId: string) => void;
  onSizeChange?: (cardId: string, newSize: BentoCardSize) => void;
  onPreviewSizeChange?: (cardId: string, newSize: BentoCardSize | null) => void;
}

const sizeLabels: Record<BentoCardSize, string> = {
  small: 'Pequeña (1×1)',
  medium: 'Mediana (1×1)',
  large: 'Grande (2×2)',
  wide: 'Ancha (2×1)',
  tall: 'Alta (1×2)',
};

function CardItem({ card, onEdit, onDelete, onSizeChange, onPreviewSizeChange }: CardItemProps) {
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [previewSize, setPreviewSize] = useState<BentoCardSize | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);

  // Cerrar dropdown y deseleccionar card al hacer click fuera
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
    setPreviewSize(newSize);
    setShowSizeSelector(false);
    setIsConfirming(true);
    // Notificar al componente padre para actualizar el layout del preview
    onPreviewSizeChange?.(card.id, newSize);
  };

  const handleConfirmSize = () => {
    if (previewSize && onSizeChange) {
      onSizeChange(card.id, previewSize);
    }
    setPreviewSize(null);
    setIsConfirming(false);
  };

  const handleCancelSize = () => {
    setPreviewSize(null);
    setIsConfirming(false);
    // Notificar al componente padre para restaurar el layout original
    onPreviewSizeChange?.(card.id, null);
  };

  // Card con tamaño preview si está seleccionado
  const displayCard = previewSize ? { ...card, size: previewSize } : card;

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo activar si no se hizo click en botones o controles
    const target = e.target as HTMLElement;
    // Si se hizo click en un botón o en el selector, no hacer nada
    if (target.closest('button') || target.closest('.size-selector-container')) {
      return;
    }
    // Si se hizo click en la card misma, seleccionarla
    setIsCardSelected(true);
  };

  return (
    <div 
      className="relative group h-full w-full card-item-container" 
      style={{ overflow: 'visible' }}
      onClick={handleCardClick}
    >
      {/* Botones de acción */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          className="p-2 bg-cool-sky/90 backdrop-blur-sm text-gunmetal rounded-xl hover:bg-cool-sky shadow-lg transition-all duration-200"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('¿Estás seguro de eliminar esta card?')) {
              onDelete(card.id);
            }
          }}
          className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 shadow-lg transition-all duration-200"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Selector de tamaño - Pill pequeña centrada encima de la card - Solo visible cuando la card está seleccionada */}
      {isCardSelected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-40 size-selector-container pointer-events-auto">
        {!isConfirming ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeSelector(!showSizeSelector);
              }}
              className="px-2 py-1 bg-cool-sky/90 backdrop-blur-sm text-gunmetal text-[10px] font-semibold rounded-full hover:bg-cool-sky shadow-md transition-all duration-200 flex items-center gap-1"
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

            {/* Dropdown de tamaños - abre hacia arriba con previews visuales */}
            {showSizeSelector && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gunmetal rounded-xl shadow-2xl border border-dust-grey/30 dark:border-pale-sky/20 overflow-hidden z-40 min-w-[200px] p-2">
                {(Object.keys(sizeLabels) as BentoCardSize[]).map((size) => {
                  const dimensions = sizeToGridDimensions[size];
                  const isSelected = card.size === size;
                  return (
                    <button
                      key={size}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSizeSelect(size);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? 'bg-cool-sky/20 text-cool-sky font-semibold border border-cool-sky/40'
                          : 'text-gunmetal dark:text-pale-sky hover:bg-dust-grey/10 dark:hover:bg-pale-sky/10 border border-transparent'
                      }`}
                    >
                      {/* Preview visual del tamaño */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0" style={{ width: `${dimensions.w * 12 + (dimensions.w - 1) * 2}px` }}>
                        {Array.from({ length: dimensions.h }).map((_, row) => (
                          <div key={row} className="flex gap-0.5">
                            {Array.from({ length: dimensions.w }).map((_, col) => (
                              <div
                                key={col}
                                className={`w-3 h-3 rounded-sm ${
                                  isSelected ? 'bg-cool-sky' : 'bg-dust-grey/40 dark:bg-pale-sky/30'
                                }`}
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
        ) : (
          /* Botones de confirmación cuando hay preview */
          <div className="flex gap-1.5 bg-white/95 dark:bg-gunmetal/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg border border-cool-sky/30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmSize();
              }}
              className="px-2 py-0.5 bg-cool-sky text-gunmetal text-[10px] font-semibold rounded-full hover:bg-cool-sky/90 transition-colors"
            >
              ✓ OK
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelSize();
              }}
              className="px-2 py-0.5 bg-dust-grey/20 dark:bg-pale-sky/20 text-gunmetal dark:text-pale-sky text-[10px] font-semibold rounded-full hover:bg-dust-grey/30 dark:hover:bg-pale-sky/30 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        </div>
      )}
      
      {/* Card real - renderizado directo sin clases de grid porque React Grid Layout controla el tamaño */}
      <div style={{ height: '100%', width: '100%', overflow: 'visible' }}>
        {(() => {
          const isBackgroundImage = displayCard.image && (displayCard.imageAsBackground || displayCard.type === 'image');
          return (
            <div className={`group relative overflow-hidden rounded-xl ${isBackgroundImage ? '' : 'bg-white dark:bg-gunmetal/50'} border border-dust-grey/20 dark:border-pale-sky/10 shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:scale-[1.02] hover:border-cool-sky/30 dark:hover:border-cool-sky/20 h-full w-full`}>
              {/* Imagen de fondo */}
              {isBackgroundImage && displayCard.image && (
                <div className="absolute inset-0">
                  <img
                    src={displayCard.image}
                    alt={displayCard.title || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="relative h-full p-6 flex flex-col justify-end text-white">
                    {displayCard.title && (
                      <h3 className="text-xl font-semibold mb-2 drop-shadow-lg">
                        {displayCard.title}
                      </h3>
                    )}
                    {displayCard.description && (
                      <p className="text-sm text-white/90 drop-shadow-md leading-relaxed">
                        {displayCard.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Contenido normal */}
              {!isBackgroundImage && (
                <div className="h-full p-6 flex flex-col">
                  {displayCard.image && (
                    <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-dust-grey/20 dark:bg-pale-sky/10">
                      <img
                        src={displayCard.image}
                        alt={displayCard.title || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {displayCard.socialPlatform && !displayCard.image && (
                    <div className={`${displayCard.size === 'small' ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'} flex mb-4 flex-grow`}>
                      {displayCard.socialUsername ? (
                        <SocialProfilePreview 
                          platform={displayCard.socialPlatform} 
                          username={displayCard.socialUsername}
                          url={displayCard.url}
                          cardSize={displayCard.size}
                        />
                      ) : (
                        <div className={`${displayCard.size === 'small' ? 'flex-row items-center gap-2' : 'flex-col items-center justify-center'} flex`}>
                          <div className={`${displayCard.size === 'small' ? 'w-8 h-8' : 'w-24 h-24'} rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 ${displayCard.size === 'small' ? '' : 'mb-3'} flex items-center justify-center border-2 border-cool-sky/30`}>
                            <SocialIcon platform={displayCard.socialPlatform} size={displayCard.size === 'small' ? 20 : 48} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
            {displayCard.icon && !displayCard.image && !displayCard.socialPlatform && (
              <div className="mb-4 text-5xl flex items-center justify-center">{displayCard.icon}</div>
            )}

            {displayCard.title && (
              <h3 className="text-lg font-semibold text-gunmetal dark:text-alice-blue mb-2">
                {displayCard.title}
              </h3>
            )}

            {displayCard.description && (
              <p className="text-sm text-gunmetal/70 dark:text-pale-sky/80 mb-4 flex-grow leading-relaxed">
                {displayCard.description}
              </p>
            )}

            {displayCard.content && (
              <div className="flex-grow">{displayCard.content}</div>
            )}
          </div>
        )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default function CardManagerRGL() {
  const [cards, setCards] = useState<BentoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<BentoCard | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [layouts, setLayouts] = useState<ResponsiveLayouts>({
    lg: [],
    md: [],
    sm: [],
    xs: [],
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalLayouts, setOriginalLayouts] = useState<ResponsiveLayouts>({
    lg: [],
    md: [],
    sm: [],
    xs: [],
  });
  // Ya no usamos customSizes porque no permitimos resizing manual

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const fetchedCards = await getCards();
      setCards(fetchedCards);
      
      // Generar layouts iniciales con algoritmo mejorado
      const initialLayouts: CardLayout[] = [];
      let currentX = 0;
      let currentY = 0;
      const cols = 3;
      
      fetchedCards.forEach((card, index) => {
        // Si la card tiene layout guardado, usarlo
        if (card.layout) {
          initialLayouts.push(card.layout);
          // Actualizar posición actual para evitar solapamientos
          currentX = card.layout.x + card.layout.w;
          currentY = Math.max(currentY, card.layout.y);
        } else {
          // Generar nuevo layout
          const dimensions = sizeToGridDimensions[card.size] || { w: 1, h: 1 };
          
          // Si no cabe en la fila actual, pasar a la siguiente
          if (currentX + dimensions.w > cols) {
            currentX = 0;
            currentY += dimensions.h;
          }
          
          const layout: CardLayout = {
            x: currentX,
            y: currentY,
            w: dimensions.w,
            h: dimensions.h,
            i: card.id,
          };
          
          initialLayouts.push(layout);
          
          // Actualizar posición para la siguiente card
          currentX += dimensions.w;
          if (currentX >= cols) {
            currentX = 0;
            currentY += dimensions.h;
          }
        }
      });
      
      // Crear layouts para diferentes breakpoints (convertir CardLayout[] a LayoutItem[])
      const convertToLayout = (cardLayouts: CardLayout[], maxCols: number = 3): LayoutItem[] => {
        return cardLayouts.map(l => ({
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          i: l.i,
          minW: 1,
          maxW: maxCols,
          minH: 1,
          maxH: 4,
        }));
      };

      const lgLayouts = convertToLayout(initialLayouts, 3);
      const mdLayouts = convertToLayout(initialLayouts.map((l) => {
        // En md (2 columnas), ajustar posiciones
        const mdCols = 2;
        const x = l.x >= mdCols ? 0 : Math.min(l.x, mdCols - l.w);
        return { ...l, x: Math.max(0, x), w: Math.min(l.w, mdCols) };
      }), 2);
      const smLayouts = convertToLayout(initialLayouts.map((l, i) => ({
        ...l,
        x: 0,
        w: 1,
        y: i, // Apilar verticalmente
      })), 1);
      const xsLayouts = convertToLayout(initialLayouts.map((l, i) => ({
        ...l,
        x: 0,
        w: 1,
        y: i, // Apilar verticalmente
      })), 1);

      const newLayouts = {
        lg: lgLayouts,
        md: mdLayouts,
        sm: smLayouts,
        xs: xsLayouts,
      };
      
      setLayouts(newLayouts);
      setOriginalLayouts(newLayouts);
      setHasUnsavedChanges(false);
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

  const handlePreviewSizeChange = (cardId: string, newSize: BentoCardSize | null) => {
    if (!newSize) {
      // Restaurar layout original recargando
      loadCards();
      return;
    }
    
    // Actualizar layout para preview
    const newDimensions = sizeToGridDimensions[newSize] || { w: 1, h: 1 };
    const currentLayout = layouts.lg?.find(l => (l as LayoutItem).i === cardId);
    
    if (currentLayout && layouts.lg && layouts.md) {
      const updatedLayouts: ResponsiveLayouts = {
        ...layouts,
        lg: layouts.lg.map((l) => {
          const layoutItem = l as LayoutItem;
          return layoutItem.i === cardId 
            ? { ...layoutItem, w: newDimensions.w, h: newDimensions.h }
            : l;
        }),
        md: layouts.md.map((l) => {
          const layoutItem = l as LayoutItem;
          return layoutItem.i === cardId 
            ? { ...layoutItem, w: Math.min(newDimensions.w, 2), h: newDimensions.h }
            : l;
        }),
      };
      setLayouts(updatedLayouts);
    }
  };

  const handleSizeChange = async (cardId: string, newSize: BentoCardSize) => {
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;
      
      // Obtener nuevas dimensiones del tamaño
      const newDimensions = sizeToGridDimensions[newSize] || { w: 1, h: 1 };
      
      // Actualizar tamaño en la base de datos
      await updateCard(cardId, { size: newSize });
      
      // Actualizar layout local inmediatamente para feedback visual
      const currentLayout = layouts.lg?.find(l => (l as LayoutItem).i === cardId);
      if (currentLayout && layouts.lg && layouts.md) {
        const updatedLayouts: ResponsiveLayouts = {
          ...layouts,
          lg: layouts.lg.map((l) => {
            const layoutItem = l as LayoutItem;
            return layoutItem.i === cardId 
              ? { ...layoutItem, w: newDimensions.w, h: newDimensions.h, minW: 1, maxW: 3, minH: 1, maxH: 4 }
              : l;
          }),
          md: layouts.md.map((l) => {
            const layoutItem = l as LayoutItem;
            return layoutItem.i === cardId 
              ? { ...layoutItem, w: Math.min(newDimensions.w, 2), h: newDimensions.h, minW: 1, maxW: 2, minH: 1, maxH: 4 }
              : l;
          }),
        };
        setLayouts(updatedLayouts);
        
        // También actualizar en la base de datos
        await updateCardLayout(cardId, {
          x: currentLayout.x,
          y: currentLayout.y,
          w: newDimensions.w,
          h: newDimensions.h,
        });
      }
      
      // Actualizar cards localmente
      setCards(prevCards => 
        prevCards.map(c => c.id === cardId ? { ...c, size: newSize } : c)
      );
    } catch (error) {
      console.error('Error updating card size:', error);
      alert('Error al actualizar el tamaño de la card');
    }
  };

  // Manejar cambios de layout (drag & drop)
  const handleLayoutChange = useCallback(
    (layout: Layout, allLayouts: ResponsiveLayouts) => {
      // Actualizar layouts locales inmediatamente para feedback visual en tiempo real
      setLayouts(allLayouts);
      
      // Marcar que hay cambios sin guardar
      setHasUnsavedChanges(true);
    },
    []
  );


  const handleSaveLayout = async () => {
    try {
      const lgLayout = layouts.lg || [];
      
      // Guardar cada layout en la base de datos
      await Promise.all(
        lgLayout.map((item) => {
          const layoutItem = item as LayoutItem;
          return updateCardLayout(layoutItem.i, {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          });
        })
      );
      
      // Actualizar layouts originales
      setOriginalLayouts(layouts);
      setHasUnsavedChanges(false);
      alert('Layout guardado correctamente');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Error al guardar el layout');
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
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveLayout}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar Organización
            </button>
          )}
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-medium rounded-md transition-colors"
          >
            + Nueva Card
          </button>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-gunmetal/30 rounded-2xl p-6 border-2 border-dashed border-dust-grey/30 dark:border-pale-sky/20 min-h-[600px]" style={{ overflow: 'visible' }}>
        <Responsive
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={180}
          margin={[16, 16]}
          containerPadding={[20, 20]}
          {...({
            compactType: "vertical",
            preventCollision: false,
            useCSSTransforms: false, // Deshabilitar para evitar saltos
            isDraggable: true,
            isResizable: false, // Deshabilitado - solo tamaños predeterminados
            isBounded: false,
            allowOverlap: false,
            draggableCancel: 'button, .size-selector-container, .card-item-container button',
          } as any)}
        >
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="bg-transparent"
              style={{ overflow: 'visible' }}
            >
              <CardItem
                card={card}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSizeChange={handleSizeChange}
                onPreviewSizeChange={handlePreviewSizeChange}
              />
            </div>
          ))}
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
    </div>
  );
}

