'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';

export default function Cart() {
  const { t } = useLanguage();
  const { items: cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  const total = subtotal;

  return (
    <>
      <Header />
      <main className="flex-grow bg-white dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8">{t.cart.title}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">shopping_cart</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Votre panier est vide</h2>
                  <p className="text-slate-500 mb-6">Découvrez nos produits et commencez vos achats.</p>
                  <Link href="/categories" className="inline-block bg-primary hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Continuer mes achats
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-full sm:w-32 aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${item.image}')` }}></div>
                    </div>
                    <div className="flex-grow flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/product/${item.id}`}>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                        </Link>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">{item.price} DH</div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {item.price * item.quantity} DH
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.cart.summary}</h2>
                
                <div className="flex flex-col gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                    <span>{t.cart.subtotal}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{subtotal} DH</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{t.cart.total}</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{total} <span className="text-xl">DH</span></span>
                </div>

                <Link href="/checkout" className="w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)] flex items-center justify-center gap-3 mb-4">
                  {t.cart.checkout}
                  <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
                </Link>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                  <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                  {t.cart.securePayment}
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
