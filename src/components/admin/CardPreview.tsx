'use client';

import { BentoCard } from '@/types/bento';
import BentoCardComponent from '@/components/BentoCard';
import { useRef } from 'react';
import { BentoCardSize } from '@/types/bento';

/**
 * CardPreview muestra una vista previa EXACTA usando el mismo grid y componente que la página principal
 * Incluye funcionalidad de resize interactivo
 */
export default function CardPreview({ 
  card, 
  onSizeChange,
  isResizable = false 
}: { 
  card: BentoCard;
  onSizeChange?: (newSize: BentoCardSize) => void;
  isResizable?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mapeo de tamaños a col-span y row-span (igual que en BentoCard)
  const sizeToGrid: Record<BentoCardSize, { col: number; row: number }> = {
    small: { col: 1, row: 1 },
    medium: { col: 1, row: 1 },
    large: { col: 2, row: 2 },
    wide: { col: 2, row: 1 },
    tall: { col: 1, row: 2 },
  };

  // Mapeo inverso: de col/row a tamaño
  const gridToSize = (col: number, row: number): BentoCardSize => {
    if (col === 2 && row === 2) return 'large';
    if (col === 2 && row === 1) return 'wide';
    if (col === 1 && row === 2) return 'tall';
    if (col === 1 && row === 1) return 'small';
    return 'small';
  };

  const handleResizeClick = (direction: 'wider' | 'narrower' | 'taller' | 'shorter') => {
    if (!isResizable || !onSizeChange) return;
    
    const currentGrid = sizeToGrid[card.size];
    let newCol = currentGrid.col;
    let newRow = currentGrid.row;
    
    switch (direction) {
      case 'wider':
        newCol = Math.min(2, currentGrid.col + 1);
        break;
      case 'narrower':
        newCol = Math.max(1, currentGrid.col - 1);
        break;
      case 'taller':
        newRow = Math.min(2, currentGrid.row + 1);
        break;
      case 'shorter':
        newRow = Math.max(1, currentGrid.row - 1);
        break;
    }
    
    const newSize = gridToSize(newCol, newRow);
    if (newSize !== card.size) {
      onSizeChange(newSize);
    }
  };

  const grid = sizeToGrid[card.size];

  return (
    <div className="w-full">
      {/* Grid simulado igual que en la página principal */}
      {/* Usamos min-height para asegurar que el grid muestre el tamaño correcto */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{
          gridAutoRows: 'minmax(150px, auto)',
        }}
      >
        {/* Solo mostrar esta card en el grid simulado */}
        <div
          ref={cardRef}
          className={`relative ${isResizable ? 'group' : ''}`}
          style={{
            gridColumn: `span ${grid.col}`,
            gridRow: `span ${grid.row}`,
          }}
        >
          {/* Card real usando el componente de producción */}
          <BentoCardComponent card={card} />
          
          {/* Handles de resize (solo si isResizable) */}
          {isResizable && onSizeChange && (
            <>
              {/* Botones de resize en los bordes - con stopPropagation para evitar drag */}
              {/* Borde derecho - hacer más ancho */}
              {grid.col < 2 && (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResizeClick('wider');
                  }}
                  className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-12 cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-30 bg-cool-sky/80 hover:bg-cool-sky rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
                  title="Hacer más ancho"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Borde izquierdo - hacer más estrecho */}
              {grid.col > 1 && (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResizeClick('narrower');
                  }}
                  className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-6 h-12 cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-30 bg-cool-sky/80 hover:bg-cool-sky rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
                  title="Hacer más estrecho"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Borde inferior - hacer más alto */}
              {grid.row < 2 && (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResizeClick('taller');
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-6 cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-30 bg-cool-sky/80 hover:bg-cool-sky rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
                  title="Hacer más alto"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              
              {/* Borde superior - hacer más bajo */}
              {grid.row > 1 && (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResizeClick('shorter');
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-6 cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-30 bg-cool-sky/80 hover:bg-cool-sky rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
                  title="Hacer más bajo"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Badge con información del tamaño */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cool-sky/10 dark:bg-cool-sky/20 text-cool-sky dark:text-cool-sky border border-cool-sky/20">
          {card.size} ({grid.col}×{grid.row})
        </span>
        {isResizable && (
          <span className="text-xs text-gunmetal/50 dark:text-pale-sky/50">
            Arrastra los bordes para cambiar tamaño
          </span>
        )}
      </div>
    </div>
  );
}
