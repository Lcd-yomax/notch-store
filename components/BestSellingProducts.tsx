'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';

export default function BestSellingProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Grab a different slice for 'Best Sellers'
        setProducts(data.slice(5, 9) || []);
      } catch (err) {
        console.error('Failed to load best selling products', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBestSellers();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.home.bestSellingProducts}</h2>
            <p className="text-slate-500 text-base md:text-lg">{t.home.bestSellingDesc}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-[350px]"></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.home.bestSellingProducts}</h2>
          <p className="text-slate-500 text-base md:text-lg">{t.home.bestSellingDesc}</p>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
          {t.home.seeAll}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="relative aspect-square  dark:bg-slate-800 overflow-hidden">
              {product.thumbnail_url ? (
                <Image
                  src={ImageSizes.small(product.thumbnail_url || '')}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"

                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
              )}

            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating || '5.0'}</span>
                <span className="text-sm text-slate-400">({product.reviews || '0'})</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="mt-auto flex items-center gap-3">
                <span className="font-black text-lg text-slate-900 dark:text-white">
                  {product.variations?.[0]?.price ? `${product.variations[0].price} DH` : 'N/A'}
                </span>
                {product.variations?.[0]?.price_display && product.variations[0].price_display > product.variations[0].price && (
                  <span className="text-sm text-slate-400 line-through font-medium">{product.variations[0].price_display} DH</span>
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
