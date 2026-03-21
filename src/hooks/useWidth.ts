'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook to measure and track the width of a container element.
 * Uses ResizeObserver for efficient updates with requestAnimationFrame debouncing.
 * Returns the container ref, measured width, and a mounted flag for SSR safety.
 */
export function useWidth(defaultWidth = 1200) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        // Ignore invalid widths (collapsed containers, hidden elements)
        if (newWidth > 100) {
          setWidth(newWidth);
        }
      }
    };

    // Initial measurement
    updateWidth();

    // ResizeObserver with rAF debounce for performance
    let rafId: number;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateWidth);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { width, containerRef, mounted };
}
