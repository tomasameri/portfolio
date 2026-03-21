'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import SocialIcon from '@/components/SocialIcon';
import { useLocale } from '@/context/LocaleContext';

export default function ContactPage() {
  const { messages } = useLocale();
  const t = messages.contact;

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cool-sky/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pale-sky/10 dark:bg-cool-sky/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Info & Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8 pt-10"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-cool-sky bg-cool-sky/10 rounded-full"
              >
                {t.badge}
              </motion.span>
              <h1 className="text-5xl md:text-6xl font-bold text-gunmetal dark:text-alice-blue leading-tight mb-6">
                {t.heroTitleStart} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cool-sky to-blue-600">
                  {t.heroTitleHighlight}
                </span>
              </h1>
              <p className="text-lg text-gunmetal/70 dark:text-pale-sky/80 max-w-md leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="p-4 bg-white/50 dark:bg-gunmetal/50 rounded-2xl backdrop-blur-sm border border-dust-grey/10 dark:border-pale-sky/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="text-2xl text-cool-sky" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gunmetal/50 dark:text-pale-sky/50 uppercase tracking-wide">{t.emailLabel}</h3>
                  <a href="mailto:tomasameridev@gmail.com" className="text-xl font-medium text-gunmetal dark:text-alice-blue hover:text-cool-sky dark:hover:text-cool-sky transition-colors">
                    tomasameridev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-4 bg-white/50 dark:bg-gunmetal/50 rounded-2xl backdrop-blur-sm border border-dust-grey/10 dark:border-pale-sky/10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt className="text-2xl text-cool-sky" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gunmetal/50 dark:text-pale-sky/50 uppercase tracking-wide">{t.locationLabel}</h3>
                  <p className="text-xl font-medium text-gunmetal dark:text-alice-blue">
                    {t.locationValue}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-sm font-semibold text-gunmetal/50 dark:text-pale-sky/50 uppercase tracking-wide mb-4">{t.followMe}</h3>
              <div className="flex space-x-4">
                <a href="https://github.com/tomasameri" target="_blank" rel="noopener noreferrer">
                  <SocialIcon platform="github" size={24} className="hover:text-cool-sky transition-colors cursor-pointer hover:scale-110 transform duration-200" />
                </a>
                <a href="https://www.linkedin.com/in/tomasameri/" target="_blank" rel="noopener noreferrer">
                  <SocialIcon platform="linkedin" size={24} className="hover:text-cool-sky transition-colors cursor-pointer hover:scale-110 transform duration-200" />
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
            <div className="bg-white/70 dark:bg-gunmetal/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 dark:border-pale-sky/10 shadow-xl shadow-gunmetal/5 dark:shadow-black/20 relative overflow-hidden group">
              {/* Highlight gradient effect on form hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cool-sky/10 rounded-full blur-[60px] group-hover:bg-cool-sky/20 transition-colors duration-500" />

              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gunmetal dark:text-pale-sky ml-1">{t.form.nameLabel}</label>
                    <input
                      type="text"
                      id="name"
                      placeholder={t.form.namePlaceholder}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gunmetal/50 border border-dust-grey/20 dark:border-pale-sky/10 rounded-xl focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky outline-none transition-all placeholder:text-gunmetal/30 dark:placeholder:text-pale-sky/30 text-gunmetal dark:text-alice-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gunmetal dark:text-pale-sky ml-1">{t.form.emailLabel}</label>
                    <input
                      type="email"
                      id="email"
                      placeholder={t.form.emailPlaceholder}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gunmetal/50 border border-dust-grey/20 dark:border-pale-sky/10 rounded-xl focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky outline-none transition-all placeholder:text-gunmetal/30 dark:placeholder:text-pale-sky/30 text-gunmetal dark:text-alice-blue"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gunmetal dark:text-pale-sky ml-1">{t.form.subjectLabel}</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder={t.form.subjectPlaceholder}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gunmetal/50 border border-dust-grey/20 dark:border-pale-sky/10 rounded-xl focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky outline-none transition-all placeholder:text-gunmetal/30 dark:placeholder:text-pale-sky/30 text-gunmetal dark:text-alice-blue"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gunmetal dark:text-pale-sky ml-1">{t.form.messageLabel}</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={t.form.messagePlaceholder}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gunmetal/50 border border-dust-grey/20 dark:border-pale-sky/10 rounded-xl focus:ring-2 focus:ring-cool-sky/50 focus:border-cool-sky outline-none transition-all placeholder:text-gunmetal/30 dark:placeholder:text-pale-sky/30 text-gunmetal dark:text-alice-blue resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-cool-sky hover:bg-cool-sky/90 text-gunmetal font-bold rounded-xl shadow-lg shadow-cool-sky/20 hover:shadow-cool-sky/40 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>{t.form.submitButton}</span>
                  <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
