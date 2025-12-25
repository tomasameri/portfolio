'use client';

import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    toggleDarkMode();
  };

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <button
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-alice-blue dark:bg-gunmetal shadow-lg border border-dust-grey/30 dark:border-pale-sky/15"
        aria-label="Toggle dark mode"
        disabled
      >
        <FiMoon className="h-5 w-5 text-gunmetal dark:text-pale-sky" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-alice-blue dark:bg-gunmetal shadow-lg border border-dust-grey/30 dark:border-pale-sky/15 hover:border-cool-sky/50 dark:hover:border-cool-sky/30 hover:shadow-xl transition-all"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiSun className="h-5 w-5 text-pale-sky hover:text-cool-sky transition-colors" />
      ) : (
        <FiMoon className="h-5 w-5 text-gunmetal hover:text-cool-sky transition-colors" />
      )}
    </button>
  );
}

