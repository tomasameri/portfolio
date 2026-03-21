'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
import GlassContainer from '@/components/ui/GlassContainer';

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
          <div className="p-2.5 rounded-xl text-on-surface-muted flex items-center gap-2">
            <FiGlobe className="h-5 w-5" />
            <span className="text-sm font-label uppercase">EN</span>
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
          className="p-2.5 rounded-xl text-on-surface-variant hover:text-accent hover:bg-accent-container transition-all flex items-center gap-2"
          aria-label="Toggle locale"
          title={locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}
        >
          <FiGlobe className="h-5 w-5" />
          <span className="text-sm font-label font-medium uppercase">
            {locale}
          </span>
        </button>
      </GlassContainer>
    </div>
  );
}
