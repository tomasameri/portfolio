interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Glassmorphism container — ONLY for floating UI elements:
 * navigation dock, theme toggle, locale toggle.
 * Uses 20px backdrop blur per design spec.
 */
export default function GlassContainer({ children, className = '' }: GlassContainerProps) {
  return (
    <div
      className={`
        bg-surface-container/60
        backdrop-blur-[20px]
        rounded-2xl
        border border-on-surface-muted/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}
