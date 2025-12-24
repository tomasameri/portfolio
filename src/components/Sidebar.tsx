'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { FiUser, FiFileText, FiBriefcase, FiBook, FiMail } from 'react-icons/fi';

const navItems = [
  { id: 'about', icon: FiUser, href: '/about' },
  { id: 'projects', icon: FiBriefcase, href: '/projects' },
  { id: 'blog', icon: FiBook, href: '/blog' },
  { id: 'contact', icon: FiMail, href: '/contact' },
];

export default function Sidebar() {
  const { locale, messages } = useLocale();
  const quote = "Your time is limited, so don't waste it living someone else's life.";

  return (
    <aside className="w-full md:w-64 lg:w-80 flex-shrink-0">
      <div className="sticky top-8 space-y-8">
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <Image
              src="/profile.jpg"
              alt="Tomas Ameri"
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback si no hay imagen
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-initials')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-initials w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500';
                  fallback.textContent = 'TA';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Tomas Ameri
          </h1>
        </div>

        {/* Quote */}
        <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-4">
          <p className="text-gray-600 dark:text-gray-300 italic text-sm md:text-base leading-relaxed">
            &quot;{quote}&quot;
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">
                  {messages.nav[item.id as keyof typeof messages.nav]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

