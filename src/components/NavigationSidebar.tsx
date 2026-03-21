'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { FiHome, FiUser, FiBriefcase, FiBook, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import GlassContainer from '@/components/ui/GlassContainer';

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

    return (
        <motion.nav
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group transition-all duration-300 pointer-events-none"
        >
            <div className="transform -translate-x-[60%] hover:translate-x-0 transition-all duration-300 ease-in-out pointer-events-auto ml-2">
                <GlassContainer className="flex flex-col gap-3 p-2 shadow-lg shadow-black/10">
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
                                        ? 'bg-accent text-surface shadow-md shadow-accent/20 scale-100'
                                        : 'text-on-surface-muted hover:text-accent hover:bg-accent-container scale-90 hover:scale-100'}
                                `}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-3 py-1.5 bg-surface-container-highest backdrop-blur-[20px] text-on-surface text-xs font-label font-medium rounded-lg opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-50">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </GlassContainer>
            </div>
        </motion.nav>
    );
}
