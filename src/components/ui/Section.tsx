interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Tonal section wrapper — one step above the page background.
 * Use for grouping content areas within a page.
 */
export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`bg-surface-container-low rounded-card p-8 md:p-12 ${className}`}>
      {children}
    </section>
  );
}
