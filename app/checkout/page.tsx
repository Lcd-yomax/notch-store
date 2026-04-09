'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { pixelInitiateCheckout } from '@/lib/pixel';

export default function Checkout() {
  const { t } = useLanguage();
  const { subtotal, totalItems, clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store total so the success page can fire an accurate Purchase pixel event
    sessionStorage.setItem('lastOrderValue', String(subtotal));
    clearCart();
    router.push('/success');
  };

  // Fire pixel when user reaches checkout
  useEffect(() => {
    if (subtotal > 0) {
      pixelInitiateCheckout({ value: subtotal, numItems: totalItems });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-8">{t.checkout.title}</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {/* Informations personnelles */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  {t.checkout.personalInfo}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="fullName" className="text-sm font-bold text-slate-700">{t.product.orderForm?.fullName || 'Nom complet'}</label>
                    <input type="text" id="fullName" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.product.orderForm?.fullName || 'Nom complet'} />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="phone" className="text-sm font-bold text-slate-700">{t.checkout.phone}</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      pattern="^0[678][0-9]{8}$"
                      title="Le numéro doit commencer par 06, 07 ou 08 et contenir 10 chiffres (ex: 0612345678)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse de livraison */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  {t.checkout.shippingAddress}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="address" className="text-sm font-bold text-slate-700">{t.checkout.address}</label>
                    <input type="text" id="address" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.address} />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="city" className="text-sm font-bold text-slate-700">{t.checkout.city}</label>
                    <input type="text" id="city" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.city} />
                  </div>
                </div>
              </div>

              {/* Méthode de paiement */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  {t.checkout.paymentMethod}
                </h2>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="payment" value="cod" className="w-5 h-5 text-primary focus:ring-primary" defaultChecked />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{t.checkout.cod}</span>
                      <span className="text-sm text-slate-500">{t.checkout.codDesc}</span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-primary text-3xl">money</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">{t.checkout.orderSummary}</h2>

                <div className="flex flex-col gap-4 mb-6 border-b border-slate-200 pb-6">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>{t.cart.subtotal} ({totalItems} {t.checkout.items})</span>
                    <span className="text-slate-900 font-bold">{subtotal} DH</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-slate-900">{t.cart.total}</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{subtotal} <span className="text-xl">DH</span></span>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)] flex items-center justify-center gap-3 mb-4 cursor-pointer">
                  {t.checkout.confirmOrder}
                  <span className="material-symbols-outlined">check_circle</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                  {t.checkout.secureData}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
