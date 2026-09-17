'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';
import ProductRating from './ProductRating';
import { StorageChips } from '@/components/ProductCard';
import type { CardProduct } from '@/lib/catalog/types';
import { cardPricing, isPhone } from '@/lib/catalog/variants';

export default function BestSellingProducts({ products }: { products: CardProduct[] }) {
  const { t } = useLanguage();

  if (!products.length) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.home.bestSellingProducts}</h2>
          <p className="text-slate-500 text-base md:text-lg">{t.home.bestSellingDesc}</p>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
          {t.home.seeAll}
          <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const pricing = cardPricing(product);
          const inStock = isPhone(product.public_variations) || product.public_variations.some((variation) => variation.is_active && variation.stock > 0);
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug || product.id}`}
              className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                {product.thumbnail_url ? (
                  <Image
                    src={ImageSizes.small(product.thumbnail_url)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <ProductRating product={product} />
                <p className={`text-sm font-semibold my-2 ${inStock ? 'text-emerald-700' : 'text-slate-500'}`}>{inStock ? t.product.inStock : t.product.outOfStock}</p>
                {product.hide_price && product.brands && (
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{product.brands.name}</p>
                )}
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                {product.hide_price && <StorageChips product={product} className="mb-3" />}
                <div className="mt-auto flex items-center gap-3">
                  {product.hide_price ? (
                    <span className="font-black text-lg text-slate-900">{t.phone.priceOnRequest}</span>
                  ) : (
                    <>
                      <span className="font-black text-lg text-slate-900">{pricing ? `${pricing.price} DH` : 'N/A'}</span>
                      {pricing?.priceDisplay && pricing.priceDisplay > pricing.price && (
                        <span className="text-sm text-slate-400 line-through font-medium">{pricing.priceDisplay} DH</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl w-full hover:bg-slate-200 transition-colors"
        >
          {t.home.viewAllProducts}
        </Link>
      </div>
    </section>
  );
}
