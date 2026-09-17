'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import ProductRating from './ProductRating';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';
import type { CardProduct } from '@/lib/catalog/types';
import { cardPricing, formatStorage, isPhone, storagesOf } from '@/lib/catalog/variants';

export function StorageChips({ product, className = '' }: { product: Pick<CardProduct, 'public_variations'>; className?: string }) {
  const { t } = useLanguage();
  const storages = storagesOf(product.public_variations);
  if (storages.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {storages.map((gb) => (
        <span key={gb} className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600" dir="ltr">
          {formatStorage(gb, t.phone.units)}
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({
  product,
  showRating = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: {
  product: CardProduct;
  showRating?: boolean;
  sizes?: string;
}) {
  const { t } = useLanguage();
  const href = `/product/${product.slug || product.id}`;
  const pricing = cardPricing(product);
  const inStock = isPhone(product.public_variations) || product.public_variations.some((variation) => variation.is_active && variation.stock > 0);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
      {pricing && pricing.discount > 0 && (
        <div className="absolute top-4 start-4 z-20 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
          -{pricing.discount}%
        </div>
      )}
      <Link href={href} className={`relative w-full aspect-[4/3] overflow-hidden block ${showRating ? 'bg-slate-50' : ''}`}>
        {product.thumbnail_url ? (
          <Image
            src={ImageSizes.medium(product.thumbnail_url)}
            alt={product.name}
            fill
            sizes={sizes}
            className={`object-contain group-hover:scale-110 transition-transform duration-500 p-4 ${showRating ? 'mix-blend-multiply' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div>
          {product.hide_price && product.brands && (
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{product.brands.name}</p>
          )}
          <Link href={href}>
            <h3 className="text-slate-900 text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">{product.name}</h3>
          </Link>
          {product.hide_price && <StorageChips product={product} />}
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <span className={`text-sm font-semibold ${inStock ? 'text-emerald-700' : 'text-slate-500'}`}>{inStock ? t.product.inStock : t.product.outOfStock}</span>
          {product.hide_price ? (
            <span className="text-slate-900 font-black text-xl tracking-tight">{t.phone.priceOnRequest}</span>
          ) : (
            <div className="flex items-end gap-3">
              <span className="text-slate-900 font-black text-2xl tracking-tight">{pricing ? `${pricing.price} DH` : 'N/A'}</span>
              {pricing && pricing.discount > 0 && pricing.priceDisplay && (
                <span className="text-slate-400 line-through text-sm font-medium mb-1.5">{pricing.priceDisplay} DH</span>
              )}
            </div>
          )}
          {showRating && <ProductRating product={product} />}
        </div>
        <Link
          href={href}
          className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-transparent font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 cursor-pointer"
        >
          {product.hide_price ? (
            <>
              {t.phone.viewProduct}
              <span className="material-symbols-outlined text-xl rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform">arrow_forward</span>
            </>
          ) : (
            <>
              <ShoppingBag size={20} className="group-hover/btn:scale-110 transition-transform" />
              {inStock ? t.product.orderNow : t.phone.viewProduct}
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
