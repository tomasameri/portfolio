'use client';

import { useMemo } from 'react';
import { Responsive, LayoutItem, ResponsiveLayouts } from 'react-grid-layout';
import { BentoCard as BentoCardType } from '@/types/bento';
import BentoCard from './BentoCard';
import { useWidth } from '@/hooks/useWidth';
import { GRID_CONFIG, SIZE_TO_GRID } from '@/lib/grid-config';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface BentoGridProps {
  cards: BentoCardType[];
}

/**
 * Builds the lg (desktop, 3-col) layout from the stored card.layout data.
 * Cards without a saved layout get appended below the existing ones
 * using a simple sequential packer.
 */
function buildLgLayout(cards: BentoCardType[]): LayoutItem[] {
  const lgCols = GRID_CONFIG.cols.lg;
  const items: LayoutItem[] = [];

  // 1. Place cards that have a saved layout
  for (const card of cards) {
    if (card.layout) {
      items.push({
        i: card.id,
        x: card.layout.x,
        y: card.layout.y,
        w: card.layout.w,
        h: card.layout.h,
        static: true,
      });
    }
  }

  // 2. For cards without a saved layout, pack them below the existing ones
  const cardsWithoutLayout = cards.filter(c => !c.layout);
  if (cardsWithoutLayout.length > 0) {
    // Find the max Y extent of already-placed cards
    let maxY = 0;
    for (const item of items) {
      maxY = Math.max(maxY, item.y + item.h);
    }

    let curX = 0;
    let curY = maxY;

    for (const card of cardsWithoutLayout) {
      const dims = SIZE_TO_GRID[card.size] || { w: 1, h: 1 };
      if (curX + dims.w > lgCols) {
        curX = 0;
        curY += 1;
      }
      items.push({
        i: card.id,
        x: curX,
        y: curY,
        w: dims.w,
        h: dims.h,
        static: true,
      });
      curX += dims.w;
      if (curX >= lgCols) {
        curX = 0;
        curY += dims.h;
      }
    }
  }

  return items;
}

/**
 * Derives responsive layouts from the lg (desktop) layout.
 * - md (2 cols): clamp x and w to fit 2 columns, let RGL re-compact.
 * - sm/xs (1 col): stack all cards vertically in visual order (sorted by y, then x).
 */
function deriveResponsiveLayouts(lgLayout: LayoutItem[]): ResponsiveLayouts {
  // md: 2 columns — clamp positions
  const mdLayout: LayoutItem[] = lgLayout.map(item => ({
    ...item,
    w: Math.min(item.w, 2),
    x: Math.min(item.x, 2 - Math.min(item.w, 2)),
  }));

  // sm/xs: 1 column — stack in reading order (top-left to bottom-right)
  const sorted = [...lgLayout].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  let stackY = 0;
  const smLayout: LayoutItem[] = sorted.map(item => {
    const entry: LayoutItem = {
      ...item,
      x: 0,
      w: 1,
      y: stackY,
      h: item.h,
    };
    stackY += item.h;
    return entry;
  });

  return {
    lg: lgLayout,
    md: mdLayout,
    sm: smLayout,
    xs: smLayout,
  };
}

export default function BentoGrid({ cards }: BentoGridProps) {
  const { width, containerRef, mounted } = useWidth();

  const layouts = useMemo(() => {
    const lg = buildLgLayout(cards);
    return deriveResponsiveLayouts(lg);
  }, [cards]);

  // Avoid SSR/hydration mismatch — render nothing until mounted on client
  if (!mounted) return <div ref={containerRef} className="min-h-[400px]" />;

  return (
    <div ref={containerRef} className="bento-grid-public">
      <style jsx global>{`
        .bento-grid-public .react-grid-placeholder {
          display: none !important;
        }
        .bento-grid-public .react-resizable-handle {
          display: none !important;
        }
      `}</style>
      <Responsive
        className="layout"
        layouts={layouts}
        width={width}
        breakpoints={GRID_CONFIG.breakpoints}
        cols={GRID_CONFIG.cols}
        rowHeight={GRID_CONFIG.rowHeight}
        margin={GRID_CONFIG.margin}
        containerPadding={GRID_CONFIG.containerPadding}
        {...({
          isDraggable: false,
          isResizable: false,
          compactType: GRID_CONFIG.compactType,
          preventCollision: false,
          useCSSTransforms: true,
        } as any)}
      >
        {cards.map((card) => (
          <div key={card.id}>
            <BentoCard card={card} />
          </div>
        ))}
      </Responsive>
    </div>
  );
}
