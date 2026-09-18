'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackOrderForm from '@/components/packs/PackOrderForm';
import { PackVisual, formatPrice } from '@/components/packs/PackCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { fill } from '@/lib/i18n/format';
import { ImageSizes } from '@/lib/imageUtils';
import { formatStorage } from '@/lib/catalog/variants';
import { SITE_URL, WHATSAPP_NUMBER } from '@/lib/site';
import type { PublicPack, PublicPackItem } from '@/lib/catalog/packs';

export default function PackDetailView({ pack }: { pack: PublicPack }) {
  const { t } = useLanguage();

  const itemLabel = (item: PublicPackItem) =>
    [
      item.storage_gb != null ? formatStorage(item.storage_gb, t.phone.units) : null,
      item.ram_gb != null ? `${formatStorage(item.ram_gb, t.phone.units)} RAM` : null,
      item.color,
      item.storage_gb == null ? item.size : null,
    ]
      .filter(Boolean)
      .join(' · ');

  const whatsappUrl = () => {
    const lines = [
      t.packs.whatsappIntro,
      `${t.packs.pack}: ${pack.name}`,
      ...pack.items.map((item) => `- ${item.quantity} × ${item.product_name}${itemLabel(item) ? ` (${itemLabel(item)})` : ''}`),
      `${SITE_URL}/packs/${encodeURIComponent(pack.slug)}`,
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const saving = pack.original_price != null && pack.pack_price != null ? pack.original_price - pack.pack_price : 0;

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">{t.header.home}</Link>
            <span>/</span>
            <Link href="/packs" className="hover:text-primary">{t.packs.title}</Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
              {pack.discount_percent > 0 && (
                <div className="absolute top-4 start-4 z-20 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                  -{pack.discount_percent}%
                </div>
              )}
              <PackVisual pack={pack} sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wider text-primary mb-2">{t.packs.pack}</span>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">{pack.name}</h1>

              {pack.hide_price || pack.pack_price == null ? (
                <p className="text-2xl font-black text-slate-900 mb-6">{t.packs.priceOnRequest}</p>
              ) : (
                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{formatPrice(pack.pack_price)}</span>
                  {pack.original_price != null && saving > 0 && (
                    <>
                      <span className="text-xl text-slate-400 line-through">{formatPrice(pack.original_price)}</span>
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {fill(t.packs.youSave, { amount: formatPrice(saving) })}
                      </span>
                    </>
                  )}
                </div>
              )}

              {pack.description && <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">{pack.description}</p>}

              <h2 className="text-lg font-bold text-slate-900 mb-3">{t.packs.contains}</h2>
              <ul className="flex flex-col gap-3 mb-8">
                {pack.items.map((item) => (
                  <li key={item.variation_id}>
                    <Link
                      href={`/product/${encodeURIComponent(item.product_slug || item.product_id)}`}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3 hover:border-primary transition-colors"
                    >
                      <div className="relative size-16 shrink-0 rounded-xl bg-slate-50 overflow-hidden">
                        {item.thumbnail_url && (
                          <Image src={ImageSizes.thumbnail(item.thumbnail_url)} alt={item.product_name} fill sizes="64px" className="object-contain mix-blend-multiply p-1" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.product_name}</p>
                        {itemLabel(item) && <p className="text-sm text-slate-500">{itemLabel(item)}</p>}
                      </div>
                      <span className="shrink-0 flex items-center gap-1 text-sm font-bold text-slate-700">
                        <Check size={16} className="text-green-600" />× {item.quantity}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {pack.hide_price || pack.pack_price == null ? (
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-lg py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-3"
                >
                  {t.packs.askPriceWhatsapp}
                </a>
              ) : (
                <PackOrderForm pack={pack} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
