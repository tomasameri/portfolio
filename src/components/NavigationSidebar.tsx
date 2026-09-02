'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { FiHome, FiBriefcase, FiUser, FiBook, FiMail } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationSidebar() {
  const pathname = usePathname();
  const { locale, messages } = useLocale();

  // Hide on admin routes
  if (pathname?.includes('/admin')) {
    return null;
  }

  const navItems = [
    { id: 'home', icon: FiHome, href: '/', label: messages.nav.home },
    { id: 'projects', icon: FiBriefcase, href: '/projects', label: messages.nav.projects },
    { id: 'about', icon: FiUser, href: '/about', label: messages.nav.about },
    { id: 'blog', icon: FiBook, href: '/blog', label: messages.nav.blog },
    { id: 'contact', icon: FiMail, href: '/contact', label: messages.nav.contact },
  ];

  const getHref = (href: string) =>
    href === '/' ? `/${locale}` : `/${locale}${href}`;

  const isActive = (href: string) => {
    const hrefWithLocale = getHref(href);
    return href === '/'
      ? pathname === hrefWithLocale
      : pathname?.startsWith(hrefWithLocale);
  };

  return (
    <nav
      aria-label="Navigation Dock"
      className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-full bg-surface-container-highest/90 dark:bg-surface-container-high/90 backdrop-blur-2xl border border-on-surface-muted/20 shadow-2xl shadow-black/30 ring-1 ring-black/5 dark:ring-white/10"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={getHref(item.href)}
              aria-label={item.label}
              title={item.label}
              className={`
                relative flex items-center justify-center rounded-full text-sm sm:text-base font-label transition-colors duration-200 group
                ${active ? 'text-white px-4 sm:px-5 py-2.5 sm:py-3' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 p-3 sm:p-3.5'}
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-accent rounded-full shadow-lg shadow-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2 sm:gap-2.5">
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 flex-shrink-0 transition-transform duration-200 ${
                    active ? 'scale-105' : 'group-hover:scale-110'
                  }`}
                />
                <AnimatePresence mode="popLayout" initial={false}>
                  {active && (
                    <motion.span
                      key={`label-${item.id}`}
                      initial={{ opacity: 0, width: 0, x: -4 }}
                      animate={{ opacity: 1, width: 'auto', x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="whitespace-nowrap overflow-hidden font-semibold select-none text-sm sm:text-base"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
