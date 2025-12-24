// src/app/[lang]/page.tsx
'use client';

import { useLocale } from "@/context/LocaleContext";
import Sidebar from "@/components/Sidebar";
import BentoGrid from "@/components/BentoGrid";
import { BentoCard } from "@/types/bento";
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Home() {
  const { locale } = useLocale();

  // Configuración de las cards del bento grid
  const cards: BentoCard[] = [
    {
      id: 'github',
      type: 'social',
      size: 'small',
      title: 'My Github',
      description: 'Check out my code and projects',
      url: 'https://github.com/tomasameri',
      icon: '🐙',
    },
    {
      id: 'linkedin',
      type: 'social',
      size: 'small',
      title: "Let's Connect",
      description: 'linkedin.com/in/tomasameri',
      url: 'https://linkedin.com/in/tomasameri',
      icon: '💼',
    },
    {
      id: 'twitter',
      type: 'social',
      size: 'wide',
      title: 'Twitter',
      description: '@toto_visiora | CTO & Co-Founder @Visiora_ai | 22 | BA | Exploring AI, Tech & Design',
      url: 'https://twitter.com/toto_visiora',
      icon: '🐦',
    },
    {
      id: 'tiktok',
      type: 'social',
      size: 'small',
      title: 'TikTok (Personal)',
      description: '@tomiameri',
      url: 'https://tiktok.com/@tomiameri',
      icon: '🎵',
    },
    {
      id: 'instagram',
      type: 'social',
      size: 'small',
      title: 'Instagram (Personal)',
      description: '@tomiameri',
      url: 'https://instagram.com/tomiameri',
      icon: '📸',
    },
    {
      id: 'visiora',
      type: 'link',
      size: 'small',
      title: 'My Startup',
      description: 'visiora.ai',
      url: 'https://visiora.ai',
      icon: '🚀',
    },
    {
      id: 'youtube-toto',
      type: 'youtube',
      size: 'large',
      title: 'Toto (Just me playing some music)',
      description: 'Music sessions and covers',
      url: 'https://youtube.com/@totoameri',
      icon: '🎸',
    },
    {
      id: 'youtube-tomi',
      type: 'youtube',
      size: 'large',
      title: 'Tomi (Tech content & More)',
      description: 'Tech content, tutorials and more',
      url: 'https://youtube.com/@tomiameri',
      icon: '💻',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <Sidebar />

          {/* Bento Grid */}
          <div className="flex-1">
            <BentoGrid cards={cards} />
          </div>
        </div>
      </div>
    </div>
  );
}