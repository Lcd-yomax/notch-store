'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Just grab the first 5 products to act as 'Featured' for now
        setProducts(data.slice(0, 5) || []);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const largeProduct = products[0];
  const smallProducts = products.slice(1, 5);

  if (isLoading) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">{t.home.featuredProducts}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl min-h-[400px] lg:min-h-[500px]"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-square sm:aspect-auto sm:min-h-[240px]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">{t.home.featuredProducts}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Large Product */}
        {largeProduct && (
          <Link href={`/product/${largeProduct.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:min-h-[500px]">
            <div className="absolute inset-0 w-full h-full">
              {largeProduct.thumbnail_url ? (
                <Image
                  src={ImageSizes.large(largeProduct.thumbnail_url || '')}
                  alt={largeProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500 p-8"

                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-md">{largeProduct.name}</h3>
              <span className="font-medium text-white text-lg drop-shadow-md">
                {largeProduct.variations?.[0]?.price ? `${largeProduct.variations[0].price} DH` : 'N/A'}
              </span>
            </div>
          </Link>
        )}

        {/* Small Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {smallProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[240px]">
              <div className="absolute inset-0 w-full h-full">
                {product.thumbnail_url ? (
                  <Image
                    src={ImageSizes.medium(product.thumbnail_url || '')}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-1 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="font-bold text-white text-sm truncate max-w-full xl:max-w-[60%] drop-shadow-md">{product.name}</h3>
                <span className="font-medium text-white text-sm drop-shadow-md">
                  {product.variations?.[0]?.price ? `${product.variations[0].price} DH` : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
