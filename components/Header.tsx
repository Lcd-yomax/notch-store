'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import SearchModal from './SearchModal';

export default function Header({ showPromo = true }: { showPromo?: boolean }) {
  const { t, language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      {showPromo && (
        <div className="bg-slate-900 text-white text-center py-2.5 px-4 text-sm font-bold tracking-wide">
          {t.header.promo}
        </div>
      )}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Notch<span className="text-primary hidden sm:inline">Maroc</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            <Link href="/" className="text-primary font-bold text-[15px] relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-primary">{t.header.home}</Link>
            <Link href="/shop" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.shop}</Link>
            <Link href="/categories" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.categories}</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.about}</Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-bold text-[15px] transition-colors">{t.header.contact}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center p-1"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <Link href="/cart" className="relative text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center p-1">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">{totalItems}</span>
              )}
            </Link>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'ar')}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer border-none"
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center p-1"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold text-lg">{t.header.home}</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary font-bold text-lg">{t.header.shop}</Link>
            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary font-bold text-lg">{t.header.categories}</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary font-bold text-lg">{t.header.about}</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary font-bold text-lg">{t.header.contact}</Link>
          </div>
        )}
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
