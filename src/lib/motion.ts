/**
 * Shared motion configuration for the editorial design system.
 * Used across all animated components for consistent feel.
 */

export const MOTION = {
  /** Default spring — soft, editorial feel */
  spring: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },
  /** Stiffer spring — buttons, toggles */
  springStiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  /** Smooth fade — page transitions, modals */
  fade: {
    duration: 0.3,
    ease: [0.23, 1, 0.32, 1] as const,
  },
  /** Stagger config — for lists of cards */
  stagger: {
    staggerChildren: 0.06,
    delayChildren: 0.1,
  },
} as const;

/** Reusable variant sets for framer-motion */
export const VARIANTS = {
  /** Fade + rise from below */
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  /** Fade in place */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Scale in */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  /** Stagger container */
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  },
} as const;
