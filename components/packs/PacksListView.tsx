'use client';

import Link from 'next/link';
import { Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackCard from '@/components/packs/PackCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { PublicPack } from '@/lib/catalog/packs';

export default function PacksListView({ packs }: { packs: PublicPack[] }) {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{t.packs.title}</h1>
            <p className="text-slate-500 mt-2">{t.packs.subtitle}</p>
          </div>

          {packs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-10 text-center">
              <Gift className="mx-auto text-slate-300 mb-4" size={56} />
              <p className="text-lg font-bold text-slate-900 mb-6">{t.packs.empty}</p>
              <Link href="/shop" className="inline-block bg-primary hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                {t.common.backToShop}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
