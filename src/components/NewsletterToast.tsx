'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'newsletter_dismissed';
const DISMISS_TTL_DAYS = 7;

function isDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { until } = JSON.parse(raw) as { until: number };
    return Date.now() < until;
  } catch {
    return false;
  }
}

function setDismissed() {
  const until = Date.now() + DISMISS_TTL_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ until }));
}

type ToastState = 'idle' | 'loading' | 'success' | 'error' | 'already';

export default function NewsletterToast() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ToastState>('idle');
  const [message, setMessage] = useState('');

  // Show after 3s if not dismissed
  useEffect(() => {
    if (isDismissed()) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed();
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;

    setState('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setState(data.alreadySubscribed ? 'already' : 'success');
        setMessage(data.message);
        setDismissed();
        // Auto-close after 4s on success
        setTimeout(() => setVisible(false), 4000);
      } else {
        setState('error');
        setMessage(data.error || 'Algo salió mal. Intentá de nuevo.');
        console.error('Error suscribiendo:', data.details || data);
      }
    } catch (err) {
      setState('error');
      setMessage('No se pudo conectar. Intentá de nuevo.');
      console.error('Network/Client error:', err);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="newsletter-toast"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-22 sm:bottom-24 left-1/2 -translate-x-1/2 z-[200] w-[calc(100vw-2rem)] max-w-sm"
          role="dialog"
          aria-label="Suscribirse al newsletter"
        >
          {/* Glass card */}
          <div className="relative rounded-3xl border border-white/20 dark:border-pale-sky/10 bg-white/80 dark:bg-gunmetal/80 backdrop-blur-2xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Subtle gradient accent top-left */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-cool-sky/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-5">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                aria-label="Cerrar"
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gunmetal/30 dark:text-pale-sky/30 hover:text-gunmetal dark:hover:text-pale-sky hover:bg-dust-grey/20 dark:hover:bg-pale-sky/10 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              {/* Icon + Heading */}
              <div className="flex items-center gap-3 mb-3 pr-8">
                <div className="w-9 h-9 rounded-2xl bg-cool-sky/15 dark:bg-cool-sky/10 flex items-center justify-center shrink-0 border border-cool-sky/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-cool-sky">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gunmetal dark:text-alice-blue leading-tight">
                    Mis artículos, en tu casilla
                  </p>
                  <p className="text-[11px] text-gunmetal/50 dark:text-pale-sky/50 leading-tight mt-0.5">
                    Sin spam. Cuando tengo algo que vale la pena.
                  </p>
                </div>
              </div>

              {/* Form or Feedback */}
              <AnimatePresence mode="wait">
                {state === 'idle' || state === 'error' ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        id="newsletter-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="flex-1 w-full min-w-0 px-4 py-2.5 text-sm rounded-xl bg-alice-blue/60 dark:bg-pale-sky/5 border border-dust-grey/30 dark:border-pale-sky/10 text-gunmetal dark:text-alice-blue placeholder:text-gunmetal/30 dark:placeholder:text-pale-sky/30 focus:outline-none focus:ring-2 focus:ring-cool-sky/30 transition-all"
                        aria-label="Tu email"
                      />
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cool-sky text-gunmetal text-sm font-bold hover:bg-cool-sky/90 active:scale-95 transition-all shadow-sm shadow-cool-sky/20 disabled:opacity-50 whitespace-nowrap"
                      >
                        Suscribirme
                      </button>
                    </div>
                    {state === 'error' && (
                      <p className="text-[11px] text-red-500 pl-1">{message}</p>
                    )}
                  </motion.form>
                ) : state === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 py-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-cool-sky/30 border-t-cool-sky rounded-full"
                    />
                    <span className="text-sm text-gunmetal/60 dark:text-pale-sky/60">Enviando...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 py-1.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-[12px] text-gunmetal/70 dark:text-pale-sky/70">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
