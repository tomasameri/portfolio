'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiGlobe } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';

export default function LocaleToggle() {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (!mounted) return;
    
    // Obtener el pathname sin el locale
    const pathWithoutLang = pathname?.replace(/^\/(en|es)/, '') || '/';
    
    // Alternar entre en y es
    const newLocale = locale === 'en' ? 'es' : 'en';
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    
    // Navegar a la nueva ruta con el locale cambiado
    router.push(`/${newLocale}${pathWithoutLang}`);
  };

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <button
        className="fixed top-4 right-20 z-50 p-3 rounded-full bg-alice-blue dark:bg-gunmetal shadow-lg border border-dust-grey/30 dark:border-pale-sky/15"
        aria-label="Toggle locale"
        disabled
      >
        <FiGlobe className="h-5 w-5 text-gunmetal dark:text-pale-sky" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-20 z-50 p-3 rounded-full bg-alice-blue dark:bg-gunmetal shadow-lg border border-dust-grey/30 dark:border-pale-sky/15 hover:border-cool-sky/50 dark:hover:border-cool-sky/30 hover:shadow-xl transition-all flex items-center gap-2"
      aria-label="Toggle locale"
      title={locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <FiGlobe className="h-5 w-5 text-gunmetal dark:text-pale-sky hover:text-cool-sky transition-colors" />
      <span className="text-sm font-medium text-gunmetal dark:text-pale-sky hover:text-cool-sky transition-colors">
        {locale.toUpperCase()}
      </span>
    </button>
  );
}

