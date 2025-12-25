'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import type { Messages } from '@/types/messages';

type NavItem = {
  id: keyof Messages['nav'];
  href: string;
};

const navigation: NavItem[] = [
  { id: 'home', href: '/' },
  { id: 'about', href: '/about' },
  { id: 'projects', href: '/projects' },
  { id: 'blog', href: '/blog' },
  { id: 'contact', href: '/contact' },
];

export default function Header() {
  const { locale, messages } = useLocale();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-alice-blue/90 dark:bg-gunmetal/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-dust-grey/20 dark:border-pale-sky/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gunmetal dark:text-alice-blue">
                Tomas Ameri
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-gunmetal hover:text-cool-sky dark:text-pale-sky dark:hover:text-cool-sky transition-colors"
              >
                {messages.nav[item.id as keyof typeof messages.nav]}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full text-gunmetal hover:text-cool-sky dark:text-pale-sky dark:hover:text-cool-sky focus:outline-none transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="h-5 w-5 text-pale-sky" /> : <FiMoon className="h-5 w-5 text-gunmetal" />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gunmetal hover:text-cool-sky dark:text-pale-sky dark:hover:text-cool-sky focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="block h-6 w-6 text-gunmetal dark:text-pale-sky" /> : <FiMenu className="block h-6 w-6 text-gunmetal dark:text-pale-sky" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-alice-blue dark:bg-gunmetal border-t border-dust-grey/20 dark:border-pale-sky/10">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gunmetal hover:text-cool-sky hover:bg-dust-grey/20 dark:text-pale-sky dark:hover:text-cool-sky dark:hover:bg-pale-sky/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {messages.nav[item.id as keyof typeof messages.nav]}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gunmetal hover:text-cool-sky hover:bg-dust-grey/20 dark:text-pale-sky dark:hover:text-cool-sky dark:hover:bg-pale-sky/10 transition-colors"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
