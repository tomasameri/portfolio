type TitleLevel = 'display-lg' | 'display-md' | 'headline-lg' | 'headline-md' | 'headline-sm';

const levelClasses: Record<TitleLevel, string> = {
  'display-lg': 'font-display text-display-lg tracking-tight',
  'display-md': 'font-display text-display-md tracking-tight',
  'headline-lg': 'font-display text-headline-lg',
  'headline-md': 'font-display text-headline-md',
  'headline-sm': 'font-display text-headline-sm',
};

interface EditorialTitleProps {
  level: TitleLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  children: React.ReactNode;
  className?: string;
}

/**
 * Editorial typography component using Plus Jakarta Sans.
 * Maps semantic levels (display, headline) to consistent styling.
 */
export default function EditorialTitle({
  level,
  as: Tag = 'h2',
  children,
  className = '',
}: EditorialTitleProps) {
  return (
    <Tag className={`text-on-surface ${levelClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
}
