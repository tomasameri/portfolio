// src/context/LocaleContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import { DEFAULT_LOCALE } from '@/lib/siteConfig';

type Messages = typeof enMessages;

const messagesMap = {
  en: enMessages,
  es: esMessages,
} as const;

const defaultMessages = messagesMap[DEFAULT_LOCALE];

const LocaleContext = createContext<{
  locale: string;
  messages: Messages;
}>({
  locale: DEFAULT_LOCALE,
  messages: defaultMessages,
});

export function LocaleProvider({ 
  children, 
  lang 
}: { 
  children: ReactNode;
  lang: string;
}) {
  const locale = lang && ['en', 'es'].includes(lang) ? lang : DEFAULT_LOCALE;
  const messages = messagesMap[locale as keyof typeof messagesMap] || defaultMessages;

  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    console.warn('useLocale called outside of LocaleProvider');
    return { locale: DEFAULT_LOCALE, messages: defaultMessages };
  }
  return context;
}