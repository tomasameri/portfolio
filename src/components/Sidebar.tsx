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
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-dust-grey/40 dark:border-pale-sky/15 bg-alice-blue dark:bg-gunmetal shadow-sm">
                <Image
                  src="/imagen perfil.jpeg"
                  alt="Tomas Ameri"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover"
                  priority
                />
          </div>
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gunmetal dark:text-alice-blue">
            Tomas Ameri
          </h1>
        </div>

        {/* Quote */}
        <div className="border-l-2 border-cool-sky/40 dark:border-cool-sky/30 pl-4">
          <p className="text-gunmetal/70 dark:text-pale-sky/80 italic text-sm md:text-base leading-relaxed">
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
                className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gunmetal dark:text-pale-sky hover:bg-dust-grey/20 dark:hover:bg-pale-sky/10 hover:text-cool-sky dark:hover:text-cool-sky transition-colors group"
              >
                <Icon className="w-5 h-5 text-gunmetal dark:text-pale-sky group-hover:text-cool-sky dark:group-hover:text-cool-sky group-hover:scale-110 transition-all" />
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

