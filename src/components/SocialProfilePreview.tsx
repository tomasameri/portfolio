'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SocialIcon from './SocialIcon';

interface SocialProfilePreviewProps {
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'youtube';
  username: string;
  url?: string;
}

interface SocialProfilePreviewPropsWithSize extends SocialProfilePreviewProps {
  cardSize?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  customImage?: string;
}

export default function SocialProfilePreview({ platform, username, url, cardSize = 'medium', customImage }: SocialProfilePreviewPropsWithSize) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Solo mostrar preview de imagen en tamaños medio, largo y grande
  const shouldShowImagePreview = cardSize === 'medium' || cardSize === 'large' || cardSize === 'wide' || cardSize === 'tall';

  // Capitalize platform name
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  useEffect(() => {
    // Si hay una imagen personalizada, usarla
    if (customImage) {
      setProfileImage(customImage);
      setLoading(false);
      return;
    }

    // Intentar obtener imagen de perfil según la plataforma
    const fetchProfileImage = async () => {
      setLoading(true);
      try {
        let imageUrl: string | null = null;

        switch (platform) {
          // ... (same switch cases)
          case 'instagram':
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
          case 'github':
            imageUrl = `https://github.com/${username}.png`;
            break;
          case 'twitter':
          case 'linkedin':
          case 'tiktok':
          case 'youtube':
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
        }

        if (imageUrl) {
          // Verificar que la imagen existe
          const img = new window.Image();
          img.onload = () => {
            setProfileImage(imageUrl);
            setLoading(false);
          };
          img.onerror = () => {
            // Fallback to simpler dicebear or just null
            setProfileImage(null);
            setLoading(false);
          };
          img.src = imageUrl;
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setLoading(false);
      }
    };

    if (username && shouldShowImagePreview && !customImage) {
      fetchProfileImage();
    } else {
      setLoading(false);
    }
  }, [platform, username, shouldShowImagePreview, customImage]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-2">
      {/* Platform Name header */}
      <h4 className="text-xs font-bold text-gunmetal/50 dark:text-pale-sky/50 tracking-wider uppercase mb-2">
        {platformName}
      </h4>

      {shouldShowImagePreview && loading ? (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 mb-2 flex items-center justify-center border-2 border-cool-sky/30 animate-pulse">
          <SocialIcon platform={platform} size={40} />
        </div>
      ) : shouldShowImagePreview && profileImage ? (
        <div className="relative w-20 h-20 rounded-full mb-2 overflow-hidden border-2 border-cool-sky/30 shadow-md">
          {profileImage.endsWith('.svg') || profileImage.includes('dicebear') ? (
            <img
              src={profileImage}
              alt={`${platform} profile`}
              className="w-full h-full object-cover"
              onError={() => setProfileImage(null)}
            />
          ) : (
            <Image
              src={profileImage}
              alt={`${platform} profile`}
              fill
              className="object-cover"
              onError={() => setProfileImage(null)}
            />
          )}
        </div>
      ) : (
        <div className={`${shouldShowImagePreview ? 'w-20 h-20 mb-2' : 'w-10 h-10 mb-1'} rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 flex items-center justify-center border-2 border-cool-sky/30`}>
          <SocialIcon platform={platform} size={shouldShowImagePreview ? 40 : 20} />
        </div>
      )}

      {username && (
        <p className={`${shouldShowImagePreview ? 'text-sm' : 'text-xs'} font-bold text-gunmetal dark:text-alice-blue`}>
          {username}
        </p>
      )}
    </div>
  );
}

