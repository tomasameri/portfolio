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
}

export default function SocialProfilePreview({ platform, username, url, cardSize = 'medium' }: SocialProfilePreviewPropsWithSize) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Solo mostrar preview de imagen en tamaños medio, largo y grande
  const shouldShowImagePreview = cardSize === 'medium' || cardSize === 'large' || cardSize === 'wide' || cardSize === 'tall';

  useEffect(() => {
    // Intentar obtener imagen de perfil según la plataforma
    const fetchProfileImage = async () => {
      setLoading(true);
      try {
        let imageUrl: string | null = null;

        switch (platform) {
          case 'instagram':
            // Instagram no tiene API pública fácil, usar un servicio de proxy o placeholder
            // Por ahora usamos un placeholder con el username
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
          case 'github':
            imageUrl = `https://github.com/${username}.png`;
            break;
          case 'twitter':
            // Twitter requiere autenticación para obtener imágenes de perfil
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
          case 'linkedin':
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
          case 'tiktok':
            imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            break;
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

    if (username && shouldShowImagePreview) {
      fetchProfileImage();
    } else {
      setLoading(false);
    }
  }, [platform, username, shouldShowImagePreview]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {shouldShowImagePreview && loading ? (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 mb-3 flex items-center justify-center border-2 border-cool-sky/30 animate-pulse">
          <SocialIcon platform={platform} size={48} />
        </div>
      ) : shouldShowImagePreview && profileImage ? (
        <div className="relative w-24 h-24 rounded-full mb-3 overflow-hidden border-2 border-cool-sky/30">
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
        <div className={`${shouldShowImagePreview ? 'w-24 h-24 mb-3' : 'w-12 h-12 mb-2'} rounded-full bg-gradient-to-br from-cool-sky/20 to-cool-sky/40 dark:from-cool-sky/30 dark:to-cool-sky/50 flex items-center justify-center border-2 border-cool-sky/30`}>
          <SocialIcon platform={platform} size={shouldShowImagePreview ? 48 : 24} />
        </div>
      )}
      {username && (
        <p className={`${shouldShowImagePreview ? 'text-sm' : 'text-xs'} font-medium text-gunmetal dark:text-alice-blue`}>
          @{username}
        </p>
      )}
    </div>
  );
}

