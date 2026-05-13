import React, { createContext, useContext, useState, ReactNode } from 'react';
import { uk } from './uk';
import { en } from './en';

type Locale = 'uk' | 'en';
type Translations = typeof uk;

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('uk');
  const t = locale === 'uk' ? uk : en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextProps => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
