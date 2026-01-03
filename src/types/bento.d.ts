export type BentoCardSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export type BentoCardType = 'link' | 'image' | 'text' | 'social' | 'youtube' | 'custom';

export type CardGroupType = 'social' | 'projects' | 'blog' | 'contact';

// Layout para React Grid Layout
export interface CardLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string; // id de la card
}

export interface BentoCard {
  id: string;
  type: BentoCardType;
  size: BentoCardSize;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  imageAsBackground?: boolean; // Si true, la imagen ocupa todo el card como fondo
  icon?: string | React.ReactNode;
  socialPlatform?: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  socialUsername?: string; // Username para redes sociales (ej: "tomiameri")
  color?: string;
  content?: React.ReactNode;
  group?: CardGroupType;
  // Campos de layout para React Grid Layout (opcionales para backward compatibility)
  layout?: CardLayout;
}

export interface CardGroup {
  id: CardGroupType;
  title: string;
  icon: string;
  color: string;
  cards: BentoCard[];
  previewCards?: number; // Number of cards to show in preview
}
