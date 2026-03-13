'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { categorySliderData as categoriesData } from '@/lib/dummyData';

export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categoriesData.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="flex flex-col items-center gap-4 min-w-[140px] md:min-w-[180px] snap-start group/item"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <Image 
                  src={category.image} 
                  alt={t.home.categoryNames[category.id as keyof typeof t.home.categoryNames]}
                  fill
                  className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-base">
                {t.home.categoryNames[category.id as keyof typeof t.home.categoryNames]}
              </span>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
