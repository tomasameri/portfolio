'use client';

import { motion } from 'framer-motion';

type ButtonVariant = 'filled' | 'tonal' | 'ghost';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  filled: 'bg-accent text-surface font-semibold hover:brightness-110',
  tonal: 'bg-accent-container text-accent font-medium hover:bg-accent-container/80',
  ghost: 'text-on-surface-variant font-medium hover:bg-surface-container-high',
};

/**
 * Primary CTA button with spring micro-animation.
 * Three variants: filled (accent bg), tonal (soft bg), ghost (transparent).
 */
export default function PrimaryButton({
  children,
  variant = 'filled',
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-button
        font-body text-sm
        transition-colors duration-200
        outline-none focus-visible:ring-2 focus-visible:ring-accent/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
