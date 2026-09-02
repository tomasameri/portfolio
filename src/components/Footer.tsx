'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useLocale } from '@/context/LocaleContext';

const socialLinks = [
  { name: 'X / Twitter', icon: FaTwitter, href: 'https://twitter.com/toto_visiora' },
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/in/tomasameri' },
  { name: 'GitHub', icon: FaGithub, href: 'https://github.com/tomasameri' },
  { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@tomiameri' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/tomiameri' },
  { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@tomiameri' },
];

export default function Footer() {
  const pathname = usePathname();
  const { locale, messages } = useLocale();

  // Hide on admin routes
  if (pathname?.includes('/admin')) {
    return null;
  }

  const isEs = locale === 'es';

  return (
    <footer className="bg-surface-container border-t border-on-surface-muted/10 text-on-surface-variant transition-colors duration-200 mt-20">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display font-bold text-2xl text-on-surface tracking-tight">
              Tomas Ameri
            </h3>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant max-w-md">
              {isEs
                ? 'Estudiante de Sistemas y constructor de productos digitales. Diseñando y escalando soluciones en la intersección de Inteligencia Artificial aplicada, automatización y marketplaces.'
                : 'Systems student and digital product builder. Designing and scaling solutions at the intersection of applied AI, automation, and marketplaces.'}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-accent font-semibold">
                <span>CreatorPlace</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-label text-xs uppercase tracking-widest text-on-surface font-bold">
              {isEs ? 'Navegación' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-accent transition-colors"
                >
                  {messages.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-accent transition-colors"
                >
                  {messages.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/projects`}
                  className="hover:text-accent transition-colors"
                >
                  {messages.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-accent transition-colors"
                >
                  {messages.nav.blog}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="hover:text-accent transition-colors"
                >
                  {messages.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social Profiles */}
          <div className="space-y-4">
            <h4 className="font-label text-xs uppercase tracking-widest text-on-surface font-bold">
              {isEs ? 'Redes' : 'Connect'}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-surface-container-high hover:bg-accent-container text-on-surface-variant hover:text-accent transition-all ring-1 ring-on-surface-muted/10 hover:scale-105"
                    aria-label={item.name}
                    title={item.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom copyright & Made in Argentina */}
        <div className="mt-12 pt-8 border-t border-on-surface-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-on-surface-muted">
          <p>
            © {new Date().getFullYear()} Tomas Ameri. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Made in Argentina</span>
            <span aria-label="Argentina" role="img">🇦🇷</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
