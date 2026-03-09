'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import SearchModal from './SearchModal';

export default function Header({ showPromo = true }: { showPromo?: boolean }) {
  const { t, language, setLanguage } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {showPromo && (
        <div className="bg-slate-900 text-white text-center py-2.5 px-4 text-sm font-bold tracking-wide">
          {t.header.promo}
        </div>
      )}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Notch<span className="text-primary">Maroc</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-primary font-bold text-[15px] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-primary">{t.header.home}</Link>
            <Link href="/shop" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.shop}</Link>
            <Link href="/categories" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.categories}</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.about}</Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.contact}</Link>
          </nav>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <Link href="/cart" className="relative text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">2</span>
            </Link>
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              {language === 'fr' ? 'AR' : 'FR'}
            </button>
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
