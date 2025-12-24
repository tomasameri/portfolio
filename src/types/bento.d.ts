export type BentoCardSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export type BentoCardType = 'link' | 'image' | 'text' | 'social' | 'youtube' | 'custom';

export interface BentoCard {
  id: string;
  type: BentoCardType;
  size: BentoCardSize;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  icon?: string;
  color?: string;
  content?: React.ReactNode;
}

