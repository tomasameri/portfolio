import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference on the client side
    if (typeof window !== 'undefined') {
      const isDark = localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.theme = newDarkMode ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <header className="bg-white/80 dark:bg-cool-steel/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-dusty-olive dark:text-lemon-chiffon">
                Tomas Ameri
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-dusty-olive hover:text-dry-sage dark:text-lemon-chiffon dark:hover:text-light-blue transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full text-dusty-olive hover:text-dry-sage dark:text-lemon-chiffon dark:hover:text-light-blue focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dusty-olive hover:text-dry-sage focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-dusty-olive hover:bg-light-blue/10 dark:text-lemon-chiffon dark:hover:bg-cool-steel/50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-dusty-olive hover:bg-light-blue/10 dark:text-lemon-chiffon dark:hover:bg-cool-steel/50"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
