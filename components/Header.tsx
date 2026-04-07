'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import SearchModal from './SearchModal';

export default function Header({ showPromo = true }: { showPromo?: boolean }) {
  const { t, language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load header categories', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      {showPromo && (
        <div className="bg-slate-900 text-white py-2.5 text-sm font-bold tracking-wide overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap w-max">
            {/* We render the items twice to create the seamless infinite loop */}
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center">
                {(t.header.promoItems || [t.header.promo]).map((item: string, idx: number) => (
                  <span key={idx} className="flex items-center">
                    <span className="px-8 lg:px-12">{item}</span>
                    <span className="text-primary text-xs">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-28 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            {/* Light mode logo */}
            <Image
              src="/images/logo/logo-light.png"
              alt="Notch Logo"
              width={220}
              height={120}
              className="w-auto object-contain block dark:hidden"
              style={{ height: '120px', width: 'auto' }}
              priority
            />
            {/* Dark mode logo */}
            <Image
              src="/images/logo/logo-dark.png"
              alt="Notch Logo"
              width={220}
              height={120}
              className="w-auto object-contain hidden dark:block"
              style={{ height: '120px', width: 'auto' }}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1 pr-12 lg:pr-24 gap-6 lg:gap-10">
            <Link href="/shop" className={`relative text-[15px] font-bold transition-colors ${pathname.startsWith('/shop') ? 'text-primary after:w-full' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary after:w-0 hover:after:w-full'} after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300`}>{t.header.shop}</Link>
            <div className="group relative h-full flex items-center">
              <Link href="/categories" className={`flex items-center gap-1 relative text-[15px] font-bold transition-colors py-6 ${pathname.startsWith('/categories') ? 'text-primary after:w-full' : 'text-slate-600 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary after:w-0 group-hover:after:w-full'} after:content-[''] after:absolute after:bottom-4 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300`}>
                {t.header.categories}
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] xl:w-[900px] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 overflow-hidden transform group-hover:translate-y-0 translate-y-3 cursor-default">
                <div className="p-8">
                  {/* Category Links */}
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {categories.length > 0 ? categories.map((category) => (
                      <Link key={category.id} href={`/categories/${category.slug}`} className="flex items-center gap-4 group/item p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-400">image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover/item:text-primary transition-colors">
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{category.products?.[0]?.count || 0} {((t as any).products) || 'Produits'}</p>
                        </div>
                      </Link>
                    )) : (
                      <div className="col-span-3 text-slate-500 p-4">Chargement des catégories...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/about" className={`relative text-[15px] font-bold transition-colors ${pathname === '/about' ? 'text-primary after:w-full' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary after:w-0 hover:after:w-full'} after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300`}>{t.header.about}</Link>
            <Link href="/contact" className={`relative text-[15px] font-bold transition-colors ${pathname === '/contact' ? 'text-primary after:w-full' : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary after:w-0 hover:after:w-full'} after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300`}>{t.header.contact}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            {/* <Link href="/cart" className="relative text-slate-700 dark:text-slate-200 hover:text-primary transition-colors flex items-center justify-center p-1">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">{totalItems}</span>
              )}
            </Link> */}
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
          <div className="md:hidden absolute top-28 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg py-4 px-4 flex flex-col gap-4">
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-lg transition-colors ${pathname.startsWith('/shop') ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>{t.header.shop}</Link>
            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-lg transition-colors ${pathname.startsWith('/categories') ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>{t.header.categories}</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-lg transition-colors ${pathname === '/about' ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>{t.header.about}</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-lg transition-colors ${pathname === '/contact' ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}>{t.header.contact}</Link>
          </div>
        )}
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
