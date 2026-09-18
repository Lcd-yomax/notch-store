'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ProductNotFound() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <h1 className="text-2xl font-bold mb-4 text-slate-900">{t.common.productNotFound}</h1>
        <Link href="/shop" className="text-primary hover:underline">{t.common.backToShop}</Link>
      </main>
      <Footer />
    </>
  );
}
