'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { motion } from 'framer-motion';
import { FiCpu, FiLayers, FiTrendingUp } from 'react-icons/fi';
import EditorialTitle from '@/components/ui/EditorialTitle';
import Card from '@/components/ui/Card';

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
    <div className="min-h-screen container mx-auto px-6 py-24 md:py-32 max-w-4xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {/* Header / Intro Section */}
        <motion.section variants={itemVariants} className="space-y-8">
          <EditorialTitle level="display-lg" as="h1" className="bg-clip-text text-transparent bg-gradient-to-r from-on-surface to-accent">
            {t.title}
          </EditorialTitle>
          <div className="text-xl md:text-2xl font-body leading-relaxed text-on-surface">
            <p>
              <span className="font-semibold text-accent">{t.intro.greeting} </span>
              {t.intro.role}
            </p>
          </div>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl leading-relaxed border-l-2 border-accent pl-6 italic">
            {t.intro.motivation}
          </p>
        </motion.section>

        {/* How I Work Section - Card Style */}
        <motion.section variants={itemVariants}>
          <Card className="relative p-10 md:p-12 overflow-hidden ring-1 ring-on-surface-muted/10">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-600 rounded-2xl blur opacity-10 pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-accent-container rounded-2xl text-accent">
                  <FiLayers size={32} />
                </div>
                <div>
                  <EditorialTitle level="headline-lg" as="h2">{t.howIWork.title}</EditorialTitle>
                  <span className="text-sm font-label text-accent tracking-widest uppercase mt-1 block">{t.howIWork.subtitle}</span>
                </div>
              </div>

              <p className="text-lg font-body text-on-surface-variant leading-relaxed">
                {t.howIWork.description}
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Current State & Goal - Split Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.section variants={itemVariants}>
            <Card className="p-8 h-full ring-1 ring-on-surface-muted/5 hover:ring-accent/30 transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-accent-container rounded-xl text-accent">
                  <FiTrendingUp size={24} />
                </div>
                <EditorialTitle level="headline-md" as="h3">Growth</EditorialTitle>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed">
                {t.currentStage.description}
              </p>
            </Card>
          </motion.section>

          <motion.section variants={itemVariants}>
            <Card className="p-8 h-full ring-1 ring-on-surface-muted/5 hover:ring-accent/30 transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-accent-container rounded-xl text-accent">
                  <FiCpu size={24} />
                </div>
                <EditorialTitle level="headline-md" as="h3">Goal</EditorialTitle>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed">
                {t.goal.description}
              </p>
            </Card>
          </motion.section>
        </div>

      </motion.div>
    </div>
  );
}
