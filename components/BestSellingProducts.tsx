'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { bestSellingProducts } from '@/lib/dummyData';

export default function BestSellingProducts() {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.home.bestSellingProducts}</h2>
          <p className="text-slate-500 text-base md:text-lg">{t.home.bestSellingDesc}</p>
        </div>
        <Link href="/products" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
          {t.home.seeAll}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellingProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t.home.badges[product.badge as keyof typeof t.home.badges]}
                </div>
              )}
              <Image
                src={product.image}
                alt={t.home.bestSellingProductsList[product.id as keyof typeof t.home.bestSellingProductsList].name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
              </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                <span className="text-sm text-slate-400">({product.reviews})</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{t.home.bestSellingProductsList[product.id as keyof typeof t.home.bestSellingProductsList].name}</h3>
              <div className="mt-auto flex items-center gap-3">
                <span className="font-black text-lg text-slate-900 dark:text-white">{t.home.bestSellingProductsList[product.id as keyof typeof t.home.bestSellingProductsList].price}</span>
                {t.home.bestSellingProductsList[product.id as keyof typeof t.home.bestSellingProductsList].originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">{t.home.bestSellingProductsList[product.id as keyof typeof t.home.bestSellingProductsList].originalPrice}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/shop" className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-xl w-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          {t.home.viewAllProducts}
        </Link>
      </div>
    </section>
  );
}
