'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products once when modal first opens
  useEffect(() => {
    if (isOpen && allProducts.length === 0 && !isLoadingProducts) {
      setIsLoadingProducts(true);
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAllProducts(data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.variations?.[0]?.price_display ?? p.variations?.[0]?.price ?? '—',
              image: p.thumbnail_url || (p.images?.[0]?.url ?? ''),
            })));
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingProducts(false));
    }
  }, [isOpen]);

  // Focus input and lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const results = query.trim() === ''
    ? []
    : allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-4">
          <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
            placeholder={t.header.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              {isLoadingProducts ? (
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50 animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search</span>
              )}
              <p>{t.header.searchTitle}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {t.header.searchTitle}
              </h3>
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-primary font-bold mt-1">{product.price} DH</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      {language === 'ar' ? 'chevron_left' : 'chevron_right'}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link href="/shop" onClick={handleClose} className="text-primary font-bold hover:underline text-sm">
                  {t.header.viewAll}
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">sentiment_dissatisfied</span>
              <p>{t.header.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
