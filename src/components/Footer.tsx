'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useLocale } from '@/context/LocaleContext';

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, href: 'https://github.com/tomasameri' },
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/in/tomasameri' },
  { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/toto_visiora' },
  { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@tomiameri' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/tomiameri' },
  { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@tomiameri' },
];

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="bg-dusty-olive text-lemon-chiffon">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tomas Ameri</h3>
            <p className="text-lemon-chiffon/80">
              Exploring the intersection of AI, technology, and design.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/about`} className="text-lemon-chiffon/80 hover:text-white transition-colors">About Me</Link></li>
              <li><Link href={`/${locale}/projects`} className="text-lemon-chiffon/80 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-lemon-chiffon/80 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-lemon-chiffon/80 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lemon-chiffon/80 hover:text-white transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
            <div className="mt-4">
              <Link 
                href="https://visiora.ai" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-lemon-chiffon/80 hover:text-white transition-colors"
              >
                <span>Visit my startup: Visiora AI</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-lemon-chiffon/20">
          <p className="text-center text-sm text-lemon-chiffon/60">
            &copy; {new Date().getFullYear()} Tomas Ameri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
