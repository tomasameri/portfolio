export type BentoCardSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export type BentoCardType = 'link' | 'image' | 'text' | 'social' | 'youtube' | 'custom';

export type CardGroupType = 'social' | 'projects' | 'blog' | 'contact';

export interface BentoCard {
  id: string;
  type: BentoCardType;
  size: BentoCardSize;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  icon?: string | React.ReactNode;
  socialPlatform?: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  color?: string;
  content?: React.ReactNode;
  group?: CardGroupType;
}

export interface CardGroup {
  id: CardGroupType;
  title: string;
  icon: string;
  color: string;
  cards: BentoCard[];
  previewCards?: number; // Number of cards to show in preview
}
