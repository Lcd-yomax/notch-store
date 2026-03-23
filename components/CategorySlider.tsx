'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';

export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">{t.home.shopByCategory}</h2>
      <div className="relative group">
        {/* Left arrow – only shown when there are enough categories to scroll */}
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity ${categories.length <= 6 ? 'hidden' : ''}`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        <div 
          ref={scrollRef}
          className={`flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${!isLoading && categories.length <= 6 ? 'justify-center' : 'justify-start'}`}
        >
          {isLoading ? (
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4 min-w-[140px] md:min-w-[180px] snap-start">
                  <div className="w-full aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
             ))
          ) : (
            categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="flex flex-col items-center gap-4 min-w-[140px] md:min-w-[180px] snap-start group/item"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  {category.image_url ? (
                    <Image 
                      src={ImageSizes.small(category.image_url)} 
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                       <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium text-slate-900 dark:text-white text-base text-center line-clamp-1 group-hover/item:text-primary transition-colors">
                    {category.name}
                  </span>
                  {category.products && (
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {category.products[0]?.count || 0} produits
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right arrow – only shown when there are enough categories to scroll */}
        <button 
          onClick={() => scroll('right')}
          className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity ${categories.length <= 6 ? 'hidden' : ''}`}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

    </section>
  );
}
