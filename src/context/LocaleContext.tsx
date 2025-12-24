// src/context/LocaleContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';

type Messages = typeof enMessages;

const messagesMap = {
  en: enMessages,
  es: esMessages,
} as const;

const LocaleContext = createContext<{
  locale: string;
  messages: Messages;
}>({
  locale: 'en',
  messages: enMessages,
});

export function LocaleProvider({ 
  children, 
  lang 
}: { 
  children: ReactNode;
  lang: string;
}) {
  const locale = lang && ['en', 'es'].includes(lang) ? lang : 'en';
  const messages = messagesMap[locale as keyof typeof messagesMap] || enMessages;

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
    return { locale: 'en', messages: enMessages };
  }
  return context;
}