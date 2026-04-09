'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useEffect } from 'react';
import { pixelPurchase } from '@/lib/pixel';

export default function SuccessPage() {
  const { t } = useLanguage();

  // Fire Purchase pixel event (value passed via sessionStorage from checkout)
  useEffect(() => {
    const storedValue = sessionStorage.getItem('lastOrderValue');
    const value = storedValue ? parseFloat(storedValue) : 0;
    pixelPurchase({ value });
    sessionStorage.removeItem('lastOrderValue');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {t.success?.title || 'Commande réussie !'}
          </h1>
          
          <p className="text-slate-600 mb-8">
            {t.success?.message || 'Votre commande a été passée avec succès. Nous vous contacterons bientôt pour la livraison.'}
          </p>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-amber-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)]"
          >
            <span className="material-symbols-outlined">home</span>
            {t.success?.backHome || "Retour à l'accueil"}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
