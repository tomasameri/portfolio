'use client';

import { useTheme } from '@/context/ThemeContext';
import {
  SiGithub,
  SiX,
  SiInstagram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si';
// LinkedIn fue removido del set Simple Icons en react-icons 5.6; usamos el de Font Awesome.
import { FaLinkedin } from 'react-icons/fa';

interface SocialIconProps {
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  size?: number;
  className?: string;
  /** Override automatic color — useful when icon is placed on a brand-colored background */
  color?: string;
  /**
   * Accessible name for the icon. `react-icons` renders `<svg role="img">`, which
   * requires alternative text (WCAG / axe `svg-img-alt`, also flagged by AI-agent
   * SEO audits). Defaults to a readable platform name; pass '' to mark it decorative.
   */
  label?: string;
}

/** Nombre legible por plataforma para el árbol de accesibilidad. */
const platformLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

/**
 * Simple Icons (react-icons/si) — monochrome, consistent SVG brand logos.
 * In dark mode: light neutral (#e8eef2)
 * In light mode: platform brand color for recognisability
 * When `color` prop is provided it takes full precedence (e.g. white on colored bg).
 */

const brandColors: Record<string, string> = {
  github: '#24292e',
  linkedin: '#0A66C2',
  twitter: '#000000',
  instagram: '#E1306C',
  tiktok: '#010101',
  youtube: '#FF0000',
};

export default function SocialIcon({ platform, size = 48, className = '', color, label }: SocialIconProps) {
  const { darkMode } = useTheme();

  const resolvedColor = color ?? (darkMode ? '#e8eef2' : brandColors[platform] ?? '#555');

  // Nombre accesible para el <svg role="img"> que genera react-icons.
  const accessibleName = label !== undefined ? label : (platformLabels[platform] ?? platform);

  const iconProps = {
    size,
    color: resolvedColor,
    className,
    ...(accessibleName
      ? { title: accessibleName, 'aria-label': accessibleName }
      : { 'aria-hidden': true, focusable: false }),
  };

  switch (platform) {
    case 'github':
      return <SiGithub {...iconProps} />;
    case 'linkedin':
      return <FaLinkedin {...iconProps} />;
    case 'twitter':
      return <SiX {...iconProps} />;
    case 'instagram':
      return <SiInstagram {...iconProps} />;
    case 'tiktok':
      return <SiTiktok {...iconProps} />;
    case 'youtube':
      return <SiYoutube {...iconProps} />;
    default:
      return null;
  }
}
