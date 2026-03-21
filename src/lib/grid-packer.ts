/**
 * Tetris-style height-map packing for bento grid layouts.
 *
 * This module provides gap-free packing for cards of varying sizes
 * (1×1, 2×1, 1×2, 2×2, 3×1, etc.) using a column-height-map scanner.
 *
 * Shared by both the admin builder (CardManagerRGL) and the public
 * renderer (BentoGrid) to guarantee identical layout results.
 */

import type { LayoutItem, ResponsiveLayouts } from 'react-grid-layout';
import type { BentoCard } from '@/types/bento';
import { GRID_CONFIG, SIZE_TO_GRID } from './grid-config';

// ─── Core height-map packer ─────────────────────────────────────────────

/**
 * Packs items into a grid of `cols` columns using a height-map scanner.
 *
 * For each item (in order), scans every valid (x, y) position starting
 * from the top. The "valid y" for a given x-range is the maximum current
 * height across those columns. The item is placed at the position with
 * the lowest y — like a Tetris piece dropping.
 *
 * This eliminates gaps that a simple left→right, top→bottom packer misses.
 */
function packWithHeightMap(
  items: { i: string; w: number; h: number }[],
  cols: number,
  extraProps?: Partial<LayoutItem>,
): LayoutItem[] {
  const heightMap = new Array(cols).fill(0);
  const result: LayoutItem[] = [];

  for (const item of items) {
    const w = Math.min(item.w, cols); // Clamp to grid width
    const h = item.h;

    // Find the (x, y) with the lowest y where this item fits
    let bestX = 0;
    let bestY = Infinity;

    for (let x = 0; x <= cols - w; x++) {
      // The item spans columns [x, x+w). It can start at the max
      // height among those columns.
      let maxH = 0;
      for (let c = x; c < x + w; c++) {
        maxH = Math.max(maxH, heightMap[c]);
      }
      if (maxH < bestY) {
        bestY = maxH;
        bestX = x;
      }
    }

    result.push({
      i: item.i,
      x: bestX,
      y: bestY,
      w,
      h,
      ...extraProps,
    });

    // Update height map
    for (let c = bestX; c < bestX + w; c++) {
      heightMap[c] = bestY + h;
    }
  }

  return result;
}

// ─── Build lg layout from cards ─────────────────────────────────────────

interface BuildLgOptions {
  /** If true, items are marked as static (non-draggable). Used by the public grid. */
  isStatic?: boolean;
  /** Extra LayoutItem props to add to each item (minW, maxW, etc.) */
  extraProps?: Partial<LayoutItem>;
}

/**
 * Build the desktop (lg) layout from a list of BentoCards.
 *
 * - Cards WITH a saved layout keep their stored coordinates.
 * - Cards WITHOUT a saved layout are packed into the remaining
 *   space using the height-map algorithm (Tetris-style, gap-free).
 */
export function buildLgLayout(cards: BentoCard[], options: BuildLgOptions = {}): LayoutItem[] {
  const { isStatic = false, extraProps = {} } = options;
  const lgCols = GRID_CONFIG.cols.lg;
  const placed: LayoutItem[] = [];

  // 1. Place cards that already have a persisted layout
  for (const card of cards) {
    if (card.layout) {
      placed.push({
        i: card.id,
        x: card.layout.x,
        y: card.layout.y,
        w: card.layout.w,
        h: card.layout.h,
        ...(isStatic ? { static: true } : {}),
        ...extraProps,
      });
    }
  }

  // 2. Pack cards without a layout into remaining space
  const cardsWithoutLayout = cards.filter(c => !c.layout);
  if (cardsWithoutLayout.length === 0) return placed;

  // Build a height map from already-placed cards
  const heightMap = new Array(lgCols).fill(0);
  for (const item of placed) {
    for (let c = item.x; c < Math.min(item.x + item.w, lgCols); c++) {
      heightMap[c] = Math.max(heightMap[c], item.y + item.h);
    }
  }

  // Pack remaining cards using the height map
  for (const card of cardsWithoutLayout) {
    const dims = SIZE_TO_GRID[card.size] || { w: 1, h: 1 };
    const w = Math.min(dims.w, lgCols);
    const h = dims.h;

    // Find best position
    let bestX = 0;
    let bestY = Infinity;

    for (let x = 0; x <= lgCols - w; x++) {
      let maxH = 0;
      for (let c = x; c < x + w; c++) {
        maxH = Math.max(maxH, heightMap[c]);
      }
      if (maxH < bestY) {
        bestY = maxH;
        bestX = x;
      }
    }

    placed.push({
      i: card.id,
      x: bestX,
      y: bestY,
      w,
      h,
      ...(isStatic ? { static: true } : {}),
      ...extraProps,
    });

    // Update height map
    for (let c = bestX; c < bestX + w; c++) {
      heightMap[c] = bestY + h;
    }
  }

  return placed;
}

// ─── Responsive layout derivation ───────────────────────────────────────

/**
 * Repack a layout for a given column count using the height-map algorithm.
 *
 * Items are kept in the same reading order (sorted by y then x from the
 * source layout), ensuring the admin's visual arrangement is preserved
 * across breakpoints.
 */
export function repackForCols(
  items: LayoutItem[],
  cols: number,
  extraProps?: Partial<LayoutItem>,
): LayoutItem[] {
  // Sort in reading order: top-left → bottom-right
  const ordered = [...items].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  return packWithHeightMap(
    ordered.map(item => ({
      i: item.i,
      w: Math.min(item.w, cols),
      h: item.h,
    })),
    cols,
    extraProps,
  );
}

/**
 * Derive responsive breakpoint layouts from the desktop (lg) layout.
 *
 * - lg: kept as-is (authoritative layout from admin/DB)
 * - md (2 cols): repacked with height-map to eliminate overlaps and gaps
 * - sm/xs (1 col): repacked (effectively stacked in reading order)
 */
export function deriveResponsiveLayouts(lgLayout: LayoutItem[]): ResponsiveLayouts {
  return {
    lg: lgLayout,
    md: repackForCols(lgLayout, GRID_CONFIG.cols.md, { maxW: GRID_CONFIG.cols.md }),
    sm: repackForCols(lgLayout, GRID_CONFIG.cols.sm, { maxW: GRID_CONFIG.cols.sm }),
    xs: repackForCols(lgLayout, GRID_CONFIG.cols.xs, { maxW: GRID_CONFIG.cols.xs }),
  };
}
