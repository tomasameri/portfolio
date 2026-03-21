/**
 * Shared grid configuration for Bento layout.
 * Used by both the admin builder and public renderer
 * to ensure identical layout behavior.
 */

export const GRID_CONFIG = {
  cols: { lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 } as const,
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } as const,
  rowHeight: 180,
  margin: [16, 16] as [number, number],
  containerPadding: [0, 0] as [number, number],
  compactType: 'vertical' as const,
} as const;

/**
 * Maps card size labels to grid unit dimensions (w × h).
 * - small/medium: 1×1
 * - wide: 2×1
 * - tall: 1×2
 * - large: 2×2
 */
export const SIZE_TO_GRID: Record<string, { w: number; h: number }> = {
  small:  { w: 1, h: 1 },
  medium: { w: 1, h: 1 },
  large:  { w: 2, h: 2 },
  wide:   { w: 2, h: 1 },
  tall:   { w: 1, h: 2 },
};
