'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { FiHome, FiUser, FiBriefcase, FiBook, FiMail, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import GlassContainer from '@/components/ui/GlassContainer';
import { useState, useEffect } from 'react';

export default function NavigationSidebar() {
    const pathname = usePathname();
    const { locale, messages } = useLocale();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

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
        <>
            {/* ── Desktop sidebar (hidden on mobile) ─────────────────────── */}
            <motion.nav
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 group transition-all duration-300 pointer-events-none"
            >
                <div className="transform -translate-x-[60%] hover:translate-x-0 transition-all duration-300 ease-in-out pointer-events-auto ml-2">
                    <GlassContainer className="flex flex-col gap-3 p-2 shadow-lg shadow-black/10">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.id}
                                    href={getHref(item.href)}
                                    className="relative flex items-center justify-center p-2 group/item"
                                    title={item.label}
                                >
                                    <div className={`
                                        p-2.5 rounded-xl transition-all duration-300
                                        ${active
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

            {/* ── Mobile hamburger button (hidden on desktop) ─────────────── */}
            <div className="md:hidden fixed top-6 left-6 z-[60]">
                <GlassContainer className="flex items-center p-1 shadow-lg shadow-black/5">
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2.5 rounded-xl text-on-surface-variant hover:text-accent hover:bg-accent-container transition-all"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        whileTap={{ scale: 0.92 }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="block"
                                >
                                    <FiX className="h-5 w-5" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="block"
                                >
                                    <FiMenu className="h-5 w-5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </GlassContainer>
            </div>

            {/* ── Mobile full-screen overlay menu ─────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop blur overlay */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="md:hidden fixed inset-0 z-[55] backdrop-blur-md bg-surface/70"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Menu panel */}
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="md:hidden fixed top-20 left-6 z-[60] w-56"
                        >
                            <GlassContainer className="flex flex-col gap-1 p-2 shadow-2xl shadow-black/20">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.2 }}
                                        >
                                            <Link
                                                href={getHref(item.href)}
                                                onClick={() => setMobileOpen(false)}
                                                className={`
                                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                                                    ${active
                                                        ? 'bg-accent text-surface'
                                                        : 'text-on-surface-variant hover:text-accent hover:bg-accent-container'}
                                                `}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                <span className="text-sm font-label font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </GlassContainer>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
