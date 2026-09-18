'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fr } from './dictionaries/fr';
import { ar } from './dictionaries/ar';
import { en } from './dictionaries/en';
import { dirOf, isLanguage, type Language } from './languages';

export { LANGUAGES, LANGUAGE_LABELS, type Language } from './languages';

type Dictionary = typeof fr;

const DICTIONARIES: Record<Language, Dictionary> = { fr, ar, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (isLanguage(storedLang)) {
      // eslint-disable-next-line
      setLanguageState(storedLang);
      document.documentElement.lang = storedLang;
      document.documentElement.dir = dirOf(storedLang);
    } else {
      document.documentElement.lang = 'fr';
      document.documentElement.dir = 'ltr';
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  };

  const t = DICTIONARIES[language];
  const dir = dirOf(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div className={`transition-opacity duration-300 ${!mounted ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
