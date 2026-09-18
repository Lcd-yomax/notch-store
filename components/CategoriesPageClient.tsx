'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { StorefrontCategory } from '@/lib/catalog/queries';

// Cards are ~440px wide in the 3-column desktop grid (max-w-[1440px] container)
const CARD_SIZES = '(min-width: 1440px) 440px, (min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw';

export default function CategoriesPageClient({ categories }: { categories: StorefrontCategory[] }) {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">{t.categories.title}</h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.categories.desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group relative flex flex-col bg-slate-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 aspect-[4/3]">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt=""
                    fill
                    sizes={CARD_SIZES}
                    // First card is the likely LCP; the rest of the first row is visible on desktop too
                    preload={index === 0}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-slate-800 transition-transform duration-700 group-hover:scale-110"></div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500 z-10"></div>

                <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
                  <h2 className="text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight drop-shadow-lg">{category.name}</h2>
                  <p className="text-white/90 font-medium leading-relaxed mb-6 max-w-sm drop-shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{t.misc.categoryCardDesc}</p>

                  <div className="flex items-center gap-2 bg-white/20 hover:bg-primary text-white backdrop-blur-md border border-white/30 font-bold px-6 py-3 rounded-full transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 delay-200 shadow-lg">
                    {t.categories.explore}
                    <span className="material-symbols-outlined rtl:rotate-180 text-sm">arrow_forward</span>
                  </div>
                </div>

                <div className="absolute top-6 end-6 z-20 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-white/20">
                  {category.products?.[0]?.count || 0} {t.categories.products}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
