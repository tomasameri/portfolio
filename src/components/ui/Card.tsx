'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type CardVariant = 'default' | 'elevated' | 'image';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-surface-container-high',
  elevated: 'bg-surface-container-highest',
  image: 'bg-transparent',
};

/**
 * Tonal surface card — no borders, no heavy shadows.
 * Depth is created by background color stepping.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, className = '', children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={[
          'rounded-card overflow-hidden',
          variantStyles[variant],
          interactive && 'cursor-pointer transition-colors duration-300 hover:bg-surface-container-highest',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
