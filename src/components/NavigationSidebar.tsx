'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { FiHome, FiUser, FiBriefcase, FiBook, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NavigationSidebar() {
    const pathname = usePathname();
    const { locale, messages } = useLocale();

    // No mostrar sidebar en rutas de admin
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

    return (
        <motion.nav
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group transition-all duration-300 pointer-events-none"
        >
            <div className="flex flex-col gap-4 p-2 rounded-2xl bg-white/40 dark:bg-gunmetal/40 hover:bg-white/80 dark:hover:bg-gunmetal/80 backdrop-blur-md border border-dust-grey/20 dark:border-pale-sky/10 shadow-lg shadow-gunmetal/5 dark:shadow-black/20 transform -translate-x-[60%] hover:translate-x-0 transition-all duration-300 ease-in-out pointer-events-auto ml-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const hrefWithLocale = item.href === '/' ? `/${locale}` : `/${locale}${item.href}`;
                    const isActive = item.href === '/'
                        ? pathname === hrefWithLocale
                        : pathname?.startsWith(hrefWithLocale);

                    return (
                        <Link
                            key={item.id}
                            href={hrefWithLocale}
                            className="relative flex items-center justify-center p-2 group/item"
                            title={item.label}
                        >
                            <div className={`
                                p-2.5 rounded-xl transition-all duration-300
                                ${isActive
                                    ? 'bg-cool-sky text-gunmetal shadow-cool-sky/20 shadow-md scale-100'
                                    : 'text-gunmetal/50 dark:text-pale-sky/50 hover:text-cool-sky dark:hover:text-cool-sky hover:bg-cool-sky/10 dark:hover:bg-cool-sky/10 scale-90 hover:scale-100'}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Tooltip on hover */}
                            <span className="absolute left-full ml-4 px-3 py-1.5 bg-gunmetal/90 dark:bg-pale-sky/90 backdrop-blur text-alice-blue dark:text-gunmetal text-xs font-medium rounded-lg opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-50">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
