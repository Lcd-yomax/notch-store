'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { fill } from '@/lib/i18n/format';
import { ImageSizes } from '@/lib/imageUtils';
import type { PublicPack } from '@/lib/catalog/packs';

export function formatPrice(value: number) {
  return `${value.toLocaleString('fr-MA', { maximumFractionDigits: 2 })} DH`;
}

/** Pack image, or a mosaic of the product photos when the pack has no own image */
export function PackVisual({ pack, sizes, className = '' }: { pack: PublicPack; sizes: string; className?: string }) {
  if (pack.image_url) {
    return <Image src={ImageSizes.medium(pack.image_url)} alt={pack.name} fill sizes={sizes} className={`object-cover ${className}`} />;
  }
  const thumbs = pack.items.map((item) => item.thumbnail_url).filter((url): url is string => !!url).slice(0, 4);
  if (thumbs.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
        <Gift size={48} />
      </div>
    );
  }
  return (
    <div className={`grid w-full h-full ${thumbs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 bg-slate-50 p-2`}>
      {thumbs.map((url) => (
        <div key={url} className="relative">
          <Image src={ImageSizes.medium(url)} alt="" fill sizes="25vw" className="object-contain mix-blend-multiply p-1" />
        </div>
      ))}
    </div>
  );
}

export default function PackCard({ pack }: { pack: PublicPack }) {
  const { t } = useLanguage();
  const href = `/packs/${encodeURIComponent(pack.slug)}`;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
      {pack.discount_percent > 0 && (
        <div className="absolute top-4 start-4 z-20 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
          -{pack.discount_percent}%
        </div>
      )}
      <Link href={href} className="relative w-full aspect-[4/3] overflow-hidden block">
        <PackVisual pack={pack} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="flex flex-col gap-3 p-5 flex-grow">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {fill(t.packs.productsCount, { count: pack.items.reduce((sum, i) => sum + i.quantity, 0) })}
        </span>
        <Link href={href}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{pack.name}</h3>
        </Link>
        <ul className="text-sm text-slate-500 space-y-0.5">
          {pack.items.slice(0, 3).map((item) => (
            <li key={item.variation_id} className="line-clamp-1">
              {item.quantity > 1 ? `${item.quantity} × ` : ''}
              {item.product_name}
            </li>
          ))}
          {pack.items.length > 3 && <li>{fill(t.packs.andMore, { count: pack.items.length - 3 })}</li>}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          {pack.hide_price || pack.pack_price == null ? (
            <span className="text-lg font-black text-slate-900">{t.packs.priceOnRequest}</span>
          ) : (
            <div className="flex flex-col">
              {pack.original_price != null && pack.original_price > pack.pack_price && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(pack.original_price)}</span>
              )}
              <span className="text-2xl font-black text-slate-900 tracking-tight">{formatPrice(pack.pack_price)}</span>
            </div>
          )}
          <Link href={href} className="shrink-0 bg-primary hover:bg-amber-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
            {t.packs.view}
          </Link>
        </div>
      </div>
    </div>
  );
}
