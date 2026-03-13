'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { featuredProducts } from '@/lib/dummyData';

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const largeProduct = featuredProducts[0];
  const smallProducts = featuredProducts.slice(1);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">{t.home.featuredProducts}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Large Product */}
        <Link href={`/product/${largeProduct.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src={largeProduct.image} 
              alt={t.home.featuredProductsList[largeProduct.id as keyof typeof t.home.featuredProductsList].name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-md">{t.home.featuredProductsList[largeProduct.id as keyof typeof t.home.featuredProductsList].name}</h3>
            <span className="font-medium text-white text-lg drop-shadow-md">{t.home.featuredProductsList[largeProduct.id as keyof typeof t.home.featuredProductsList].price}</span>
          </div>
        </Link>

        {/* Small Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {smallProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[240px]">
              <div className="absolute inset-0 w-full h-full">
                <Image 
                  src={product.image} 
                  alt={t.home.featuredProductsList[product.id as keyof typeof t.home.featuredProductsList].name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-1 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="font-bold text-white text-sm truncate max-w-full xl:max-w-[60%] drop-shadow-md">{t.home.featuredProductsList[product.id as keyof typeof t.home.featuredProductsList].name}</h3>
                <span className="font-medium text-white text-sm drop-shadow-md">{t.home.featuredProductsList[product.id as keyof typeof t.home.featuredProductsList].price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
