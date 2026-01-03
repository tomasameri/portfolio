'use client';

import { useEffect, useState } from 'react';
import { Responsive, LayoutItem, ResponsiveLayouts } from 'react-grid-layout';
import { BentoCard as BentoCardType } from '@/types/bento';
import BentoCard from './BentoCard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface BentoGridProps {
  cards: BentoCardType[];
}

export default function BentoGrid({ cards }: BentoGridProps) {
  const [layouts, setLayouts] = useState<ResponsiveLayouts>({
    lg: [],
    md: [],
    sm: [],
    xs: [],
  });

  useEffect(() => {
    // Convertir layouts de las cards a formato React Grid Layout
    const lgLayouts: LayoutItem[] = cards
      .filter(card => card.layout)
      .map(card => ({
        x: card.layout!.x,
        y: card.layout!.y,
        w: card.layout!.w,
        h: card.layout!.h,
        i: card.id,
        minW: 1,
        maxW: 3,
        minH: 1,
        maxH: 4,
      }));

    // Si no hay layouts guardados, usar orden por defecto basado en tamaño
    if (lgLayouts.length === 0) {
      const sizeToGridDimensions: Record<string, { w: number; h: number }> = {
        small: { w: 1, h: 1 },
        medium: { w: 1, h: 1 },
        large: { w: 2, h: 2 },
        wide: { w: 2, h: 1 },
        tall: { w: 1, h: 2 },
      };
      
      let currentX = 0;
      let currentY = 0;
      const cols = 3;
      
      cards.forEach((card) => {
        const dimensions = sizeToGridDimensions[card.size] || { w: 1, h: 1 };
        if (currentX + dimensions.w > cols) {
          currentX = 0;
          currentY += dimensions.h;
        }
        lgLayouts.push({
          x: currentX,
          y: currentY,
          w: dimensions.w,
          h: dimensions.h,
          i: card.id,
          minW: 1,
          maxW: 3,
          minH: 1,
          maxH: 4,
        });
        currentX += dimensions.w;
        if (currentX >= cols) {
          currentX = 0;
          currentY += dimensions.h;
        }
      });
    }

    const mdLayouts = lgLayouts.map((l) => ({
      ...l,
      x: Math.min(l.x, 1),
      w: Math.min(l.w, 2),
      maxW: 2,
    }));

    const smLayouts = lgLayouts.map((l, i) => ({
      ...l,
      x: 0,
      w: 1,
      y: i,
      maxW: 1,
    }));

    const xsLayouts = lgLayouts.map((l, i) => ({
      ...l,
      x: 0,
      w: 1,
      y: i,
      maxW: 1,
    }));

    setLayouts({
      lg: lgLayouts,
      md: mdLayouts,
      sm: smLayouts,
      xs: xsLayouts,
    });
  }, [cards]);

  return (
    <div className="bento-grid-preview">
      <Responsive
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={180}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        {...({
          isDraggable: false,
          isResizable: false,
          compactType: "vertical",
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

