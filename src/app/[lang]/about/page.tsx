'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { motion } from 'framer-motion';
import { FiCpu, FiLayers, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const { messages } = useLocale();
  const t = messages.about;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-20 md:py-32 max-w-4xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* Header / Intro Section */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gunmetal to-cool-sky dark:from-alice-blue dark:to-cool-sky">
            {t.title}
          </h1>
          <div className="text-xl md:text-2xl leading-relaxed text-gunmetal dark:text-alice-blue prose dark:prose-invert">
            <p>
              <span className="font-semibold text-cool-sky">{t.intro.greeting} </span>
              {t.intro.role}
            </p>
          </div>
          <p className="text-lg text-gunmetal/80 dark:text-pale-sky max-w-2xl leading-relaxed border-l-4 border-cool-sky pl-6 italic bg-alice-blue/50 dark:bg-gunmetal/50 py-2 rounded-r-lg">
            {t.intro.motivation}
          </p>
        </motion.section>

        {/* How I Work Section - Card Style */}
        <motion.section variants={itemVariants} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cool-sky to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative p-8 bg-white dark:bg-gunmetal border border-dust-grey/20 dark:border-pale-sky/10 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-cool-sky/10 rounded-xl text-cool-sky">
                <FiLayers size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gunmetal dark:text-alice-blue">{t.howIWork.title}</h2>
                <span className="text-sm font-medium text-cool-sky tracking-wider uppercase">{t.howIWork.subtitle}</span>
              </div>
            </div>

            <p className="text-lg text-gunmetal/80 dark:text-pale-sky leading-relaxed">
              {t.howIWork.description}
            </p>
          </div>
        </motion.section>

        {/* Current State & Goal - Split Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.section variants={itemVariants} className="bg-alice-blue/30 dark:bg-white/5 p-6 rounded-2xl border border-dust-grey/10 dark:border-pale-sky/5 hover:border-cool-sky/30 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-gunmetal dark:text-alice-blue">
              <FiTrendingUp className="text-cool-sky" />
              <h3 className="text-lg font-bold">Growth</h3>
            </div>
            <p className="text-gunmetal/80 dark:text-pale-sky leading-relaxed">
              {t.currentStage.description}
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="bg-alice-blue/30 dark:bg-white/5 p-6 rounded-2xl border border-dust-grey/10 dark:border-pale-sky/5 hover:border-cool-sky/30 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-gunmetal dark:text-alice-blue">
              <FiCpu className="text-cool-sky" />
              <h3 className="text-lg font-bold">Goal</h3>
            </div>
            <p className="text-gunmetal/80 dark:text-pale-sky leading-relaxed">
              {t.goal.description}
            </p>
          </motion.section>
        </div>

      </motion.div>
    </div>
  );
}
