'use client';

import { useTheme } from '@/context/ThemeContext';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

interface SocialIconProps {
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  size?: number;
  className?: string;
}

export default function SocialIcon({ platform, size = 48, className = '' }: SocialIconProps) {
  const { darkMode } = useTheme();
  
  // Color de la paleta según el tema - más claro en dark para mejor visibilidad
  const iconColor = darkMode ? '#e8eef2' : '#37393a'; // alice-blue en dark, gunmetal en light
  
  const iconProps = {
    size,
    color: iconColor,
    className,
  };

  switch (platform) {
    case 'github':
      return <FaGithub {...iconProps} />;
    case 'linkedin':
      return <FaLinkedin {...iconProps} />;
    case 'twitter':
      return <FaTwitter {...iconProps} />;
    case 'instagram':
      return <FaInstagram {...iconProps} />;
    case 'tiktok':
      return <FaTiktok {...iconProps} />;
    case 'youtube':
      return <FaYoutube {...iconProps} />;
    default:
      return null;
  }
}

