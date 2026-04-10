'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
import GlassContainer from '@/components/ui/GlassContainer';

function FlagAR({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="8" fill="#74ACDF" />
      <rect y="8" width="36" height="8" fill="#fff" />
      <rect y="16" width="36" height="8" fill="#74ACDF" />
      {/* Sun */}
      <circle cx="18" cy="12" r="3" fill="#F6B40E" />
      {[0,30,60,90,120,150,180,210,240,270,300,330,360].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = 3.5, r2 = 5.5;
        const x1 = 18 + r1 * Math.cos(rad);
        const y1 = 12 + r1 * Math.sin(rad);
        const x2 = 18 + r2 * Math.cos(rad);
        const y2 = 12 + r2 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F6B40E" strokeWidth="0.9" />;
      })}
    </svg>
  );
}

function FlagUS({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="0" y={i * 4} width="36" height="2" fill={i % 2 === 0 ? '#B22234' : '#fff'} />
      ))}
      <rect y="0" width="36" height="13" fill="none" />
      {/* Last stripe */}
      <rect x="0" y="22" width="36" height="2" fill="#B22234" />
      {/* Blue canton */}
      <rect width="15" height="13" fill="#3C3B6E" />
      {/* Stars - 5×4 simplified */}
      {[...Array(20)].map((_, i) => (
        <text key={i} x={1.5 + (i % 5) * 2.8} y={2.2 + Math.floor(i / 5) * 3} fontSize="2" fill="#fff">★</text>
      ))}
    </svg>
  );
}

export default function SettingsDock() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocaleToggle = () => {
    if (!mounted) return;
    const pathWithoutLang = pathname?.replace(/^\/(en|es)/, '') || '/';
    const newLocale = locale === 'en' ? 'es' : 'en';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    
    router.push(`/${newLocale}${pathWithoutLang}`);
  };

  if (!mounted) {
    return (
      <div className="fixed top-6 right-6 z-50 pointer-events-none">
        <GlassContainer className="flex items-center gap-1 p-1">
          <div className="p-2.5 rounded-xl text-on-surface-muted">
            <FiMoon className="h-5 w-5" />
          </div>
          <div className="w-px h-6 bg-on-surface-muted/20" />
          <div className="p-2.5 rounded-xl text-on-surface-muted flex items-center">
            <FlagUS className="h-4 w-6 rounded-sm" />
          </div>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <GlassContainer className="flex items-center gap-1 p-1 shadow-lg shadow-black/5">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl text-on-surface-variant hover:text-accent hover:bg-accent-container transition-all"
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>
        
        <div className="w-px h-6 bg-on-surface-muted/20" />
        
        <button
          onClick={handleLocaleToggle}
          className="p-2.5 rounded-xl text-on-surface-variant hover:text-accent hover:bg-accent-container transition-all flex items-center"
          aria-label="Toggle locale"
          title={locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
          {locale === 'es' ? (
            <FlagAR className="h-4 w-6 rounded-sm" />
          ) : (
            <FlagUS className="h-4 w-6 rounded-sm" />
          )}
        </button>
      </GlassContainer>
    </div>
  );
}
