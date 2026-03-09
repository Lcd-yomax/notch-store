'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Checkout() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8">{t.checkout.title}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  {t.checkout.personalInfo}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.firstName}</label>
                    <input type="text" id="firstName" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.firstName} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.lastName}</label>
                    <input type="text" id="lastName" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.lastName} />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.email}</label>
                    <input type="email" id="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="votre@email.com" />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="phone" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.phone}</label>
                    <input type="tel" id="phone" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="+212 6 XX XX XX XX" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  {t.checkout.shippingAddress}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="address" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.address}</label>
                    <input type="text" id="address" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.address} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.city}</label>
                    <input type="text" id="city" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={t.checkout.city} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="zip" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.checkout.postalCode}</label>
                    <input type="text" id="zip" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="20000" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  {t.checkout.paymentMethod}
                </h2>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="payment" value="cod" className="w-5 h-5 text-primary focus:ring-primary" defaultChecked />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">{t.checkout.cod}</span>
                      <span className="text-sm text-slate-500">{t.checkout.codDesc}</span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-primary text-3xl">money</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 hover:border-primary/50 rounded-xl cursor-pointer transition-colors opacity-50">
                    <input type="radio" name="payment" value="card" className="w-5 h-5 text-primary focus:ring-primary" disabled />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">{t.checkout.creditCard} ({t.checkout.comingSoon})</span>
                      <span className="text-sm text-slate-500">{t.checkout.creditCardDesc}</span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-slate-400 text-3xl">credit_card</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.checkout.orderSummary}</h2>
                
                <div className="flex flex-col gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                    <span>{t.cart.subtotal} (3 {t.checkout.items})</span>
                    <span className="text-slate-900 dark:text-white font-bold">447 DH</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                    <span>{t.cart.shipping}</span>
                    <span className="text-slate-900 dark:text-white font-bold">30 DH</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{t.cart.total}</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">477 <span className="text-xl">DH</span></span>
                </div>

                <button className="w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)] flex items-center justify-center gap-3 mb-4">
                  {t.checkout.confirmOrder}
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                  {t.checkout.secureData}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
