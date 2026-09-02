'use client';

import React from 'react';
import { FiCheckCircle, FiZap } from 'react-icons/fi';

interface KeyTakeawaysProps {
  points?: string[];
  title?: string;
  excerpt?: string;
  isEs?: boolean;
}

export default function KeyTakeaways({
  points,
  title,
  excerpt,
  isEs = true,
}: KeyTakeawaysProps) {
  // If points are not explicitly provided, create intelligent takeaways from excerpt or context
  const defaultPoints = isEs
    ? [
        'Arquitectura y decisiones técnicas clave explicadas desde la práctica.',
        'Reducción de fricción y optimización de flujos de trabajo.',
        'Lecciones y patrones aplicables a productos escalables.',
      ]
    : [
        'Key architectural and technical decisions explained from real-world practice.',
        'Friction reduction and workflow optimization patterns.',
        'Actionable takeaways for scalable product building.',
      ];

  const displayPoints = points && points.length > 0 ? points : defaultPoints;

  return (
    <section
      aria-label={isEs ? 'Puntos clave del artículo' : 'Key takeaways'}
      className="my-10 p-6 md:p-8 rounded-3xl bg-surface-container-high/80 border border-accent/20 shadow-sm relative overflow-hidden backdrop-blur-md"
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-accent-container text-accent rounded-xl ring-1 ring-accent/20">
          <FiZap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg md:text-xl text-on-surface">
            {isEs ? 'Puntos Clave / Key Takeaways' : 'Key Takeaways & Summary'}
          </h2>
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
            {isEs ? 'Resumen ejecutivo de lectura rápida' : 'Executive summary & quick digest'}
          </p>
        </div>
      </div>

      {excerpt && (
        <p className="font-body text-sm md:text-base text-on-surface leading-relaxed mb-4 pb-4 border-b border-on-surface-muted/10 font-medium">
          {excerpt}
        </p>
      )}

      <ul className="space-y-2.5">
        {displayPoints.map((point, index) => (
          <li key={index} className="flex items-start gap-3 text-sm font-body text-on-surface-variant leading-relaxed">
            <FiCheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
