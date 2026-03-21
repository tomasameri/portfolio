'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import SocialIcon from '@/components/SocialIcon';
import { useLocale } from '@/context/LocaleContext';
import EditorialTitle from '@/components/ui/EditorialTitle';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';

export default function ContactPage() {
  const { messages } = useLocale();
  const t = messages.contact;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-6 py-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Info & Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-10"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 mb-6 text-sm font-label tracking-widest uppercase text-accent bg-accent-container rounded-full"
              >
                {t.badge}
              </motion.span>
              <EditorialTitle level="display-md" as="h1" className="mb-6 leading-tight">
                {t.heroTitleStart} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-accent">
                  {t.heroTitleHighlight}
                </span>
              </EditorialTitle>
              <p className="text-lg font-body text-on-surface-variant max-w-md leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-5 group cursor-pointer">
                <div className="p-4 bg-surface-container-high rounded-2xl ring-1 ring-on-surface-muted/10 group-hover:bg-surface-container-highest transition-colors">
                  <FaEnvelope className="text-2xl text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-label text-on-surface-muted uppercase tracking-wide">{t.emailLabel}</h3>
                  <a href="mailto:tomasameridev@gmail.com" className="text-xl font-body font-medium text-on-surface group-hover:text-accent transition-colors">
                    tomasameridev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-5 group cursor-pointer">
                <div className="p-4 bg-surface-container-high rounded-2xl ring-1 ring-on-surface-muted/10 group-hover:bg-surface-container-highest transition-colors">
                  <FaMapMarkerAlt className="text-2xl text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-label text-on-surface-muted uppercase tracking-wide">{t.locationLabel}</h3>
                  <p className="text-xl font-body font-medium text-on-surface">
                    {t.locationValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-sm font-label text-on-surface-muted uppercase tracking-wide mb-5">{t.followMe}</h3>
              <div className="flex space-x-4">
                <a href="https://github.com/tomasameri" target="_blank" rel="noopener noreferrer" className="p-3 bg-surface-container rounded-full hover:bg-surface-container-highest transition-colors text-on-surface">
                  <SocialIcon platform="github" size={24} />
                </a>
                <a href="https://www.linkedin.com/in/tomasameri/" target="_blank" rel="noopener noreferrer" className="p-3 bg-surface-container rounded-full hover:bg-surface-container-highest transition-colors text-on-surface">
                  <SocialIcon platform="linkedin" size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <Card className="p-8 md:p-12 relative overflow-hidden ring-1 ring-on-surface-muted/10">
              {/* Highlight gradient effect on form */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-[60px]" />

              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-label text-on-surface-variant mb-1 block">{t.form.nameLabel}</label>
                    <input
                      type="text"
                      id="name"
                      placeholder={t.form.namePlaceholder}
                      className="w-full px-5 py-4 bg-surface-container border-none ring-1 ring-on-surface-muted/10 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-on-surface-muted text-on-surface font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-label text-on-surface-variant mb-1 block">{t.form.emailLabel}</label>
                    <input
                      type="email"
                      id="email"
                      placeholder={t.form.emailPlaceholder}
                      className="w-full px-5 py-4 bg-surface-container border-none ring-1 ring-on-surface-muted/10 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-on-surface-muted text-on-surface font-body"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-label text-on-surface-variant mb-1 block">{t.form.subjectLabel}</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder={t.form.subjectPlaceholder}
                    className="w-full px-5 py-4 bg-surface-container border-none ring-1 ring-on-surface-muted/10 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-on-surface-muted text-on-surface font-body"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-label text-on-surface-variant mb-1 block">{t.form.messageLabel}</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={t.form.messagePlaceholder}
                    className="w-full px-5 py-4 bg-surface-container border-none ring-1 ring-on-surface-muted/10 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-on-surface-muted text-on-surface font-body resize-none"
                  />
                </div>

                <PrimaryButton type="submit" className="w-full py-4 mt-4 group">
                  <span className="font-label tracking-wide uppercase">{t.form.submitButton}</span>
                  <FaPaperPlane className="ml-2 text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </PrimaryButton>
              </form>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
