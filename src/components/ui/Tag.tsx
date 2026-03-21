interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}

/**
 * Minimal tag / chip using Space Grotesk.
 * Two variants: tonal (default) and accent-tinted.
 */
export default function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variantClasses = {
    default: 'bg-surface-container-highest/60 text-on-surface-variant',
    accent: 'bg-accent-container text-accent',
  };

  return (
    <span
      className={`
        font-label text-label-md
        inline-flex items-center
        px-3 py-1 rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
